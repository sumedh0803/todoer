import React, { Component } from 'react'

import { IconButton, Paper, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';

export class Todo extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            id: null,
            title: null,
            body: null,
            todoColor: null,
            dueDate: null,
            dueTime: null,
            finalDate: null,
            isDue: false,
            completed: null
        }
    }
    componentDidMount(){
        let date = this.props.data.dueDate ? new Date(this.props.data.dueDate) : null
        let time = this.props.data.dueTime ? new Date(this.props.data.dueTime) : null
        let finalDate
        if(date != null && time != null)
            finalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds())
            
        else
            finalDate = null
        this.setState({
            id: this.props.data._id,
            title: this.props.data.title, 
            body: this.props.data.body,
            todoColor: this.props.data.todoColor,
            dueDate: this.props.data.dueDate ? new Date(this.props.data.dueDate) : null,
            dueTime: this.props.data.dueTime ? new Date(this.props.data.dueTime) : null,
            finalDate,
            isDue: finalDate ? Date.now() > finalDate : false,
            completed: this.props.data.completed
            })
    }
    componentDidUpdate(prevProps)
    {
        let date = this.props.data.dueDate ? new Date(this.props.data.dueDate) : null
        let time = this.props.data.dueTime ? new Date(this.props.data.dueTime) : null
        let finalDate
        if(date != null && time != null)
            finalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds())
            
        else
            finalDate = null

        if(this.props.data.title !== prevProps.data.title || this.props.data.body !== prevProps.data.body || this.props.data.id !== prevProps.data.id ||
            this.props.data.todoColor !== prevProps.data.todoColor || this.props.data.completed !== prevProps.data.completed || this.props.data.dueDate !== prevProps.data.dueDate ||
            this.props.data.dueTime !== prevProps.data.dueTime)
        this.setState({
            id: this.props.data._id,
            title: this.props.data.title, 
            body: this.props.data.body,
            todoColor: this.props.data.todoColor,
            dueDate: new Date(this.props.data.dueDate),
            dueTime: new Date(this.props.data.dueTime),
            finalDate,
            isDue: finalDate ? Date.now() > finalDate : false,
            completed: this.props.data.completed,})
    }

    getDueDate = () => {
        return `${this.state.finalDate.getMonth()+1}/${this.state.finalDate.getDate()}/${this.state.finalDate.getFullYear()}`
    }

    getDueTime = () => {
        let hrs = (this.state.finalDate.getHours() % 12 < 10 ? '0' : '') + this.state.finalDate.getHours() % 12
        let mins = (this.state.finalDate.getMinutes() < 10 ? '0' : '') + this.state.finalDate.getMinutes()
        let ampm = this.state.finalDate.getHours() >= 12 ? 'PM' : 'AM'
        return `${hrs}:${mins} ${ampm}`
        
    }
    
    render() {
        return (
            <div>
                <Paper style = {{padding: "8px 8px 0px 8px", wordBreak: 'break-word', backgroundColor: this.props.data.todoColor ? this.props.data.todoColor : "#FFFFFF", border: this.state.isDue ? "2px solid red" : "none", cursor: "pointer" }} 
                    elevation = {3} 
                    onClick = {() => this.props.openTodoHandler(this.state.id)}>
                        <div className = {this.state.completed ? "strike" : null}><b>{this.state.title}</b></div>
                        {this.state.finalDate && <Typography variant = "caption" className = {this.state.completed ? "strike" : null} style = {{color: this.state.isDue ? "red" : "black" }}>Due on {this.getDueDate()} at {this.getDueTime()}</Typography>}
                        <p className = {this.state.completed ? "strike" : null}>{this.state.body}</p>
                        <IconButton onClick = {(e) => this.props.deleteTodoHandler(e,this.state.id)}>
                            <DeleteIcon id = {this.state.id}/>
                        </IconButton>
                </Paper>
            </div>
        )
    }
}

export default Todo
