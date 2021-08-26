const express = require('express');
const mongoose = require('mongoose')
const cookieParse = require('cookie-parser')
const app = express()
require('dotenv').config();

//MongoDB conn
const dbURI = 'mongodb+srv://admin:Demo123@cluster0.xphfb.mongodb.net/todo-app?retryWrites=true&w=majority'
mongoose.connect(dbURI)
        .then((res)=>{
            app.listen(3001)
            console.log("Connected to DB")
        })
        .catch((e) => {
            console.log(e)
        })

app.use(cookieParse())
app.use(express.json()); 
const authRouter = require('./controllers/auth')
app.use('/auth',authRouter)

const todoController = require('./controllers/todoController');
app.use('/',todoController)




