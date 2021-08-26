const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose')
const cookieParse = require('cookie-parser')
const fs = require('fs');
const path = require('path')
const app = express()
require('dotenv').config();

//MongoDB conn
const dbURI = 'mongodb+srv://admin:Demo123@cluster0.xphfb.mongodb.net/todo-app?retryWrites=true&w=majority'
mongoose.connect(dbURI)
        .then((res)=>{
            app.listen(3001)
            console.log("Connected to DB")
        })
        .catch((err) => {
            console.log(err)
        })

// app.use(express.static(__dirname + '../../client/todo-client/build/'));
// app.get('/signin', (req,res)=>{
//     // console.log(fs.readdirSync(path.join(__dirname, "../")))
//     // res.send({})
//     //res.send({message: fs.readdirSync(path.join(__dirname, "public", "index.html"))})
//     res.sendFile("/index.html", { root: __dirname });
// })
// app.get('/signup', (req,res)=>{
//     res.sendFile("/index.html", { root: __dirname });
//     //res.sendFile(path.join(__dirname, "../../client/todo-client/public", "index.html"));
// })

        
app.use(cookieParse())
app.use(express.json()); 
const authRouter = require('./controllers/auth')
app.use('/auth',authRouter)

const todoController = require('./controllers/todoController');
app.use('/',todoController)

exports.app = functions.https.onRequest(app);



