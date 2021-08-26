const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    userid:{
        type:String,
        required:true
    },
    title : {
        type : String,
        required : true
    },
    body : {
        type : String
    },
    todoColor: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    dueTime: {
        type: Date
    },
    completed:{
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

const Todo = mongoose.model("Todo",todoSchema)
module.exports = Todo