import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress'


import { AuthConsumer } from '../Utils/AuthContext';

class SignUp extends Component {
    constructor()
    {
        super()
        this.state = {
            username: "",
            password: "",
            name: "",
            isSignedIn: false,
            message:null
        }
    }
    changeHandler = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitHandler = (e) =>{
        e.preventDefault()
        fetch("/auth/signup",
        {
            method: 'post',
            body: JSON.stringify({username: this.state.username,password:this.state.password,name:this.state.name}),
            headers: {"Content-Type": "application/json"}
        })
        .then(async (resp) => 
        {
            let data = await resp.json()
            if(resp.status == 200)
            {
                this.setState({
                    isSignedIn: true
                },()=>{
                    this.props.updateState()
                })
            }
            else
            {
                this.setState({
                    message:data.message,
                    isSignedIn: false
                })
            }
        })
    }

    render() {
        return (
            <AuthConsumer>
            {
                (context) => {
                    return (!context.isSignedIn ? 
                    <Grid item container xs = {12} justify="center" alignItems="center" style = {{height:"100vh"}}>
                        <Paper style = {{padding: "16px",width:"75vh"}} elevation = {3}>
                            <Typography variant = "h3">Sign Up</Typography>
                            {context.signUpError && <Alert severity="error" variant="outlined" style = {{margin: "12px 0px"}}>{context.signUpError}</Alert>}
                            <form method="post" action = "/auth/signup" onSubmit = {(e) =>{e.preventDefault(); context.signup(this.state.name, this.state.username, this.state.password)}}>
                                <TextField 
                                    name = "name"
                                    label="Name" 
                                    variant="outlined" 
                                    fullWidth
                                    style={{ margin: "4px 0px" }} 
                                    onChange={(e) => this.changeHandler(e)} />
                                
                                <TextField 
                                    name = "username"
                                    label="Username" 
                                    variant="outlined" 
                                    fullWidth
                                    style={{ margin: "4px 0px", display: "block"  }} 
                                    onChange={(e) => this.changeHandler(e)} />
                                <TextField 
                                    name = "password"
                                    label="Password" 
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    style={{ margin: "4px 0px", display: "block"}} 
                                    onChange={(e) => this.changeHandler(e)}/>
                                <Button
                                    variant="contained" 
                                    color="primary" 
                                    type="submit"
                                    fullWidth
                                    style={{ margin: "4px 0px"}} 
                                    endIcon = {context.signupInProgress && <CircularProgress style = {{color: "#FFFFFF"}} size={20}/>}>
                                        sign up
                                </Button>
                                <Typography variant = "h6">Have an account? <Link to = "/signin">Sign In</Link></Typography>

                            </form>                         
                        </Paper>
                    </Grid>
                    :
                    <Redirect to = "/"/>)

                }
            }
            </AuthConsumer>
        )
    }
}

export default SignUp
