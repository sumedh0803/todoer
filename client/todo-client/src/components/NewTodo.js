import React, { Component } from 'react'
import { Button, Grid, IconButton, Paper, TextField, Collapse, Typography, Tooltip } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import PaletteIcon from '@material-ui/icons/Palette';
import ColorPicker from './ColorPicker';
import DateFnsUtils from '@date-io/date-fns';
import Alert from '@material-ui/lab/Alert';

export class NewTodo extends Component {
    constructor()
    {
        super()
        this.state = {
            title: "",
            body: "",
            colorPickerState: false,
            dateTimePickerState: false,
            todoColor: "#FFFFFF",
            dueDate: null,
            dueTime: null,
            completed: false
        }
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

    submitHandler = (e) => {
        e.preventDefault()
        const data = this.state
        this.setState({
            title : "",
            body: "",
            todoColor: "#FFFFFF",
            colorPickerState: false,
            dateTimePickerState: false,
            dueDate: null,
            dueTime: null,
        }, ()=> {
            this.props.submitHandler(data)
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

    selectColor = (color) => {
        this.setState({
            todoColor: color
        })
    }

    getTime = () => {
        let hrs = (this.state.dueTime.getHours() % 12 < 10 ? '0' : '') + this.state.dueTime.getHours() % 12
        let mins = (this.state.dueTime.getMinutes() < 10 ? '0' : '') + this.state.dueTime.getMinutes()
        let ampm = this.state.dueTime.getHours() >= 12 ? 'PM' : 'AM'
        return `${hrs}:${mins} ${ampm}`
        
    }

    clearDue = () => {
        this.setState({
            dueDate: null,
            dueTime: null
        })
    }
    
    render() {
        return(
            <Grid  item container sm = {12} >
                <Paper style = {{padding: "16px", backgroundColor: this.state.todoColor}} elevation = {3}>
                    <Typography variant = "h4">I need to...</Typography>
                    {this.props.newTodoError && <Alert severity="error" variant="outlined" style = {{margin: "12px 0px"}}>{this.props.newTodoError}</Alert>}
                    <form method="post" action = "/todos" onSubmit = {(e) => this.submitHandler(e)}>
                        <TextField 
                            name = "title"
                            label="Title" 
                            variant="outlined" 
                            fullWidth 
                            style={{ margin: "4px 0px"  }} 
                            value = {this.state.title}
                            className = "customInput"
                            onChange={(e) => this.changeHandler(e)} />
                        <TextField 
                            name = "body"
                            label="Description" 
                            variant="outlined" 
                            fullWidth multiline 
                            className = "customInput"
                            style={{ margin: "4px 0px"}} 
                            value = {this.state.body}
                            onChange={(e) => this.changeHandler(e)}/>
                        
                        <Paper
                            elevation = {3}
                            style={{ margin: "4px 0px"}} >
                            <IconButton>
                                <Tooltip title="Set Reminder" aria-label="set reminder">
                                    <AddAlarmIcon onClick = {() => this.toggleDateTimePicker()}/>
                                </Tooltip>
                            </IconButton>                           
                            <IconButton>
                                <Tooltip title="Change Color" aria-label="change color">
                                    <PaletteIcon onClick = {() => this.toggleColorPicker()}/>
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
                                            'aria-label': 'change date',
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
                                <ColorPicker display = {this.state.colorPickerState} selectColor = {this.selectColor} selected = {this.state.todocolor}/>
                            </Collapse>
                            
                        </Paper>
                        <Grid container justify="flex-end">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit"
                                style={{ margin: "4px 0px"}} >
                                    add new to-do
                            </Button>
                        </Grid>
                        
                    </form>
                </Paper>
            </Grid>
        )
    }
}

export default NewTodo
