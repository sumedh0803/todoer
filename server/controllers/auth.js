const router = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

router.post('/signup',async (req,res)=>{
    //check if username exists
    const userExists = await User.findOne({username: req.body.username})
    if(!userExists)
    {
        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(req.body.password,salt)
        const user = new User({username: req.body.username, password: hashedPwd, name: req.body.name})
        user.save()
        .then(async resp => {
            let ip = req.socket.remoteAddress
            ip = ip.toString().replace('::ffff:', '')
            const salt2 = await bcrypt.genSalt(10)
            const hashedPayload = await bcrypt.hash(resp._id+"$"+ip,salt2)


            const accessToken = jwt.sign({id:resp._id},
                                            process.env.JWT_ACCESS_SECRET,
                                            {expiresIn:process.env.ACCESS_TOKEN_TIMEOUT_MINS*60})
            const refreshToken = jwt.sign({id: resp._id,ip,hashedPayload},
                                            process.env.JWT_REFRESH_SECRET,
                                            {expiresIn:process.env.REFRESH_TOKEN_TIMEOUT_MINS*60})
            res.cookie('accessToken',accessToken)
            res.cookie('refreshToken',refreshToken)
            res.status(200).send({"username": resp.username, "name": resp.name, "message":"User created successfully"})
        })
        .catch(err => {
            res.status(401).send({"message":err.message})
        })
    }
    else res.status(403).send({"message":"Username already exists"})
    

})

router.post('/signin',async (req,res)=>{
    const userExists = await User.findOne({username:req.body.username})
    if(!userExists) res.status(404).send({"message":"User doesnt exist"})

    const validPassword = await bcrypt.compare(req.body.password,userExists.password)
    if(!validPassword) res.status(403).send({"message":"Incorrect Credentials"})

    let ip = req.socket.remoteAddress
    ip = ip.toString().replace('::ffff:', '')

    const salt = await bcrypt.genSalt(10)
    const hashedPayload = await bcrypt.hash(userExists._id+"$"+ip,salt)
    
    const accessToken = jwt.sign({id:userExists._id},
                                process.env.JWT_ACCESS_SECRET,
                                {expiresIn:process.env.ACCESS_TOKEN_TIMEOUT_MINS*60})
    const refreshToken = jwt.sign({id: userExists._id,ip,hashedPayload},
                                    process.env.JWT_REFRESH_SECRET,
                                    {expiresIn:process.env.REFRESH_TOKEN_TIMEOUT_MINS*60})
    res.cookie('accessToken',accessToken)
    res.cookie('refreshToken',refreshToken)
    res.status(200).send({"username": userExists.username, "name": userExists.name, "message":"Login Successful"})
})

router.post('/refresh', async (req,res)=>{
    const refreshToken = req.header('refreshToken')
    if(!refreshToken) res.status(400).send({"message":"No token sent. Cannot issue new access token"})
    try
    {
        const verified = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

        let ip = req.socket.remoteAddress
        ip = ip.toString().replace('::ffff:', '')
        const id = verified.id
        const unhashedPayload = id+"$"+ip

        const validPayload = await bcrypt.compare(unhashedPayload,verified.hashedPayload)
        if(verified && validPayload) 
        {
            const accessToken = jwt.sign({id:verified.id},
                                            process.env.JWT_ACCESS_SECRET,
                                            {expiresIn:process.env.ACCESS_TOKEN_TIMEOUT_MINS*60})
            res.cookie('accessToken',accessToken)
            res.status(200).send({"message":"New token issued"})
        }
    }
    catch(err)
    {
        res.status(401).send({message:err.message,status:401})
    }
})

module.exports = router