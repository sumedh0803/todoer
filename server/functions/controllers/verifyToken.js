const jwt = require('jsonwebtoken')
module.exports = verify = (req,res,next) =>
{
    const token = req.header('accessToken')
    if(!token) res.status(400).send({message:"No token sent. Authorization failed",status:400})
    try
    {
        const verified = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        if(verified) req.user = verified
        next() 
    }
    catch(err)
    {
        res.status(401).send({message:"Invalid Token",status:401})
    }
}

