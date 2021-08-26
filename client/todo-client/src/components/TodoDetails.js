import React, { Component } from 'react'
import { Button, Collapse, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import PaletteIcon from '@material-ui/icons/Palette';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Cookies from 'universal-cookie';
import ColorPicker from './ColorPicker';
import AuthContext from '../Utils/AuthContext';

export class TodoDetails extends Component {
    static contextType = AuthContext
    constructor()
    {
        super()
        this.state = {
            title: "",
            body: "",
            colorPickerState: false,
            dateTimePickerState: true,
            todoColor: "#FFFFFF",
            dueDate: null,
            dueTime: null,
            completed: null
        }
        
    }
    componentDidMount()
    {
        this.loadTodoDetails();
    }

    loadTodoDetails()
    {
        fetch(`/todos/${this.props.todoId}`,{
            headers: {"accessToken": new Cookies().get("accessToken")}
        })
        .then(async (resp) =>{
            if(resp.status == 200)
            {
                const data = await resp.json()
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    todoColor: data.todoColor,
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                    dueTime: data.dueTime ? new Date(data.dueTime) : null,
                    createdAt: new Date(data.createdAt),
                    updatedAt: new Date(data.updatedAt),
                    completed: data.completed,
                })
            }
            else if(resp.status == 401)
            {
                const status = await this.context.refresh()
                if(status == 200) this.loadTodoDetails()   
            }
        })
    }

    
    toggleColorPicker = () => {
        this.setState(prev => ({
            colorPickerState: !prev.colorPickerState,
            dateTimePickerState: false
        }))
    }

    toggleDateTimePicker = () =>{
        this.setState(prev => ({
            dateTimePickerState: !prev.dateTimePickerState,
            colorPickerState: false
        }))
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    dateChangeHandler = (date) =>{
        this.setState(prev => ({
            dueDate: date,
            dueTime: !prev.dueTime ? new Date(date.setHours(8,0,0,0)) : prev.dueTime
        }))
    }

    timeChangeHandler = (time) =>{
        this.setState(prev => ({
            dueTime: time,
            dueDate: !prev.dueDate ? new Date(Date.now()) : prev.dueDate
        }))
    }

    getTime = () => {
        let hrs = (this.state.dueTime.getHours() % 12 < 10 ? '0' : '') + this.state.dueTime.getHours() % 12
        let mins = (this.state.dueTime.getMinutes() < 10 ? '0' : '') + this.state.dueTime.getMinutes()
        let ampm = this.state.dueTime.getHours() >= 12 ? 'PM' : 'AM'
        return `${hrs}:${mins} ${ampm}`
        
    }

    selectColor = (color) => {
        this.setState({
            todoColor: color
        })
    }

    clearDue = () => {
        this.setState({
            dueDate: null,
            dueTime: null
        })
    }

    handleTodoUpdate = () => {
        fetch(`/todos/${this.state.id}/update`,
        {
            method: "put",
            headers: {"Content-Type": "application/json", "accessToken": new Cookies().get("accessToken")},
            body : JSON.stringify(this.state)
        })
        .then(async (resp) =>{
            if(resp.status == 200)
            {
                this.props.closeTodoHandler(true)
            }
            else if(resp.status == 401)
            {
                const status = await this.context.refresh()
                if(status == 200) this.handleTodoUpdate()  
            }
            else
            {
                const error = await resp.json().message
                throw new Error(error)
            }
        })
        .catch(e=>{
            console.log(e)
        })
    }

    handleTodoComplete = () => {
        this.setState(prev => ({
            completed: !prev.completed
        }),() => {
            fetch(`/todos/${this.state.id}/complete`,
            {
                method: "put",
                headers: {"Content-Type": "application/json", "accessToken": new Cookies().get("accessToken")},
                body : JSON.stringify({completed:this.state.completed})
            })
            .then(async (resp) =>{
                if(resp.status == 200)
                {
                    setTimeout(() => {
                        this.props.closeTodoHandler(true)
                    },750)
                }
                else if(resp.status == 401)
                {
                    const status = await this.context.refresh()
                    if(status == 200) this.handleTodoComplete()  
                }
            })
        })
    }

    render() {
        return (
            this.state.title ?
                <Grid container style = {{backgroundColor: this.state.todoColor}} direction = "column">
                    <Grid item container style = {{flexWrap: "nowrap"}}>
                        <Grid item sm = {9}>
                            <DialogTitle>
                                <TextField
                                    required
                                    inputProps={{style: {fontSize: "xx-large",fontWeight: "bolder"}}}
                                    id="filled-required"
                                    name = "title"
                                    fullWidth
                                    value={this.state.title}
                                    onChange={(e) => this.changeHandler(e)}
                                />     
                            </DialogTitle>
                        </Grid>
                        <Grid item sm = {3}>
                                <IconButton style = {{float: "right"}} onClick = {() => this.props.closeTodoHandler(false)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid> 
                        </Grid>
                    <DialogContent>
                        <Grid item container spacing = {2}>
                            <Grid item sm = {6}>
                                <TextField 
                                    name = "body"
                                    fullWidth multiline 
                                    // style={{ margin: "4px 0px"}} 
                                    value = {this.state.body}
                                    onChange={(e) => this.changeHandler(e)}/>
                                <Grid item>
                                    <Typography variant = "caption"><InfoIcon fontSize = "small" style = {{transform: "translate(0px,3px)"}}/> Created on {this.state.createdAt.toLocaleString()}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant = "caption"><InfoIcon fontSize = "small" style = {{transform: "translate(0px,3px)"}}/> Last Modified on {this.state.updatedAt.toLocaleString()} </Typography>
                                </Grid>
                            </Grid>
                            <Grid item sm = {6}>
                                <Paper elevation = {3} style={{ margin: "4px 0px"}} >
                                    <IconButton onClick = {() => this.toggleDateTimePicker()}>
                                        <Tooltip title="Set Reminder" aria-label="set reminder">
                                            <AddAlarmIcon/>
                                        </Tooltip>
                                    </IconButton>                           
                                    <IconButton onClick = {() => this.toggleColorPicker()}>
                                        <Tooltip title="Change Color" aria-label="change color">
                                            <PaletteIcon/>
                                            </Tooltip>
                                    </IconButton>
                                    <IconButton onClick = {(e) => this.props.deleteTodoHandler(e,this.state.id)}>
                                        <Tooltip title="Delete To-do" aria-label="Delete To-do">
                                            <DeleteIcon id = {this.state.id}/>
                                        </Tooltip>
                                    </IconButton>
                                    {this.state.dueDate && 
                                        <Typography variant="body2" style={{ margin: "4px 12px", backgroundColor: "#FFF", marginBottom: "12px" }}>
                                            Due on {`${this.state.dueDate.getMonth()+1}/${this.state.dueDate.getDate()}/${this.state.dueDate.getFullYear()} at ${this.getTime()}`} 
                                        </Typography>
                                    }
                                    <Collapse in={this.state.dateTimePickerState || this.state.colorPickerState} timeout="auto" unmountOnExit>
                                        {this.state.dateTimePickerState ? 
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="MM/dd/yyyy"
                                                    style={{ backgroundColor: "#FFF", transform: "translateX(12px)", marginBottom: "12px" }} 
                                                    id="dueDate"
                                                    label="Due Date"
                                                    value={this.state.dueDate}
                                                    name = "dueDate"
                                                    onChange={(date)=> this.dateChangeHandler(date)}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date'
                                                    }}
                                                />
                                                <KeyboardTimePicker
                                                    style={{ margin: "4px 0px", backgroundColor: "#FFF", transform: "translateX(12px)", marginBottom: "12px" }} 
                                                    id="dueTime"
                                                    label="Due Time"
                                                    value={this.state.dueTime}
                                                    onChange={(time)=> this.timeChangeHandler(time)}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change time',
                                                    }}
                                                />
                                                {this.state.dueDate && <Button color="secondary" style={{ backgroundColor: "#FFF", transform: "translateX(12px)", marginBottom: "12px" }} onClick = {() => this.clearDue()} >Clear Due date and time</Button>}
                                        </>
                                        </MuiPickersUtilsProvider>
                                        : null}
                                        <ColorPicker display = {this.state.colorPickerState} selectColor = {this.selectColor} selected = {this.state.todoColor}/>
                                    </Collapse>
                                </Paper>    
                                <Button variant="contained" color="primary" type="submit" style={{ margin: "4px", float: "right"}} onClick = {()=> this.handleTodoUpdate()} >
                                    Update
                                </Button>   
                                <Button variant= {this.state.completed ? "outlined" : "contained"} color="secondary" type="submit" style={{ margin: "4px", float: "right"}} onClick = {()=> this.handleTodoComplete()} startIcon = {this.state.completed ? <DoneIcon/> : null}>
                                    {this.state.completed ? "Done" : "Mark As done"}
                                </Button>                                                 
                            </Grid>
                        </Grid>
                    </DialogContent>   
                </Grid>
            :
            null
            
            
        )
    }
}

export default TodoDetails
