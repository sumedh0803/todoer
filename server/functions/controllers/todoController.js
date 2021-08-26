const router = require('express').Router()
const Todo = require('../models/todos');
const verify = require('./verifyToken');
const jwt = require('jsonwebtoken')

router.get('/todos',verify,(req,res)=>{
    const jwtdata = jwt.verify(req.header('accessToken'),process.env.JWT_ACCESS_SECRET)
    Todo.find({userid:jwtdata.id}).sort({ createdAt: -1})
    .then(resp => {
        res.status(200).json(resp)
    })
    .catch((err) => {
        console.log(err)
        res.status(404).json({message:err.message})
    })
})

router.get('/todos/:id',verify,(req,res)=> {
    Todo.findById(req.params.id)
    .then(resp =>
    {
        res.status(200).json(resp)
    })
    .catch(err =>
    {
        console.log(err)
        res.status(404).json({message:err.message})
    })
})

router.put('/todos/:id/:mode', verify, (req,res)=> {
    switch(req.params.mode)
    {
        case "update":  const {title,body, todoColor, dueDate, dueTime } = req.body;
                        Todo.findByIdAndUpdate(req.params.id,
                            {title,body,todoColor, dueDate, dueTime })
                            .then(resp => {
                                res.status(200).json(resp)
                            })
                            .catch(err =>
                            {
                                console.log(err)
                                res.status(404).json({message:err.message})
                            })
                            break
        case "complete": console.log(req.body)
                        const {completed} = req.body;
                        Todo.findByIdAndUpdate(req.params.id,
                            {completed})
                            .then(resp => {
                                res.status(200).json(resp)
                            })
                            .catch(err =>
                            {
                                console.log(err)
                                res.status(404).json({message:err.message})
                            })
                            break
    }
})

router.post('/todos',verify,(req,res)=>{
    const jwtdata = jwt.verify(req.header('accessToken'),process.env.JWT_ACCESS_SECRET)
    const {title,body,todoColor, dueDate, dueTime, completed} = req.body;
    new Todo({userid: jwtdata.id, title,body,todoColor,dueDate, dueTime, completed}).save()
    .then(resp => {
        res.status(200).json({...resp,message:"Todo Saved"})
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({message:err.message})
    })

    
})

router.delete('/todos/:id',verify,(req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
    .then(resp =>{
        res.status(200).json({...resp,'reload':true})
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message:err.message})
    })
    
}) 

module.exports = router