import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { Redirect } from 'react-router'
import Alert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress'


import { AuthConsumer } from '../Utils/AuthContext';

class SignIn extends Component {
    constructor(props, context)
    {
        super(props, context)
        this.state = {
            username: "",
            password: ""
        }
    }
    changeHandler = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <AuthConsumer>
            {
                (context) => {
                    return (!context.isSignedIn ?
                    <Grid container item xs = {12} justify="center" alignItems="center" style = {{height:"100vh"}}>
                        <Paper style = {{padding: "16px",width:"75vh"}} elevation = {3}>
                            <Typography variant = "h3">Sign In</Typography>
                            {context.signInError && <Alert severity="error" variant="outlined" style = {{margin: "12px 0px"}}>{context.signInError}</Alert>}
                            <form method="post" action = "/auth/signin" onSubmit = {(e) =>{e.preventDefault(); context.signin(this.state.username, this.state.password)}}>
                                <TextField 
                                    name = "username"
                                    label="Username" 
                                    variant="outlined" 
                                    fullWidth 
                                    style={{ margin: "4px 0px"  }} 
                                    className = "customInput"
                                    onChange={(e) => this.changeHandler(e)} />
                                <TextField 
                                    name = "password"
                                    label="Password" 
                                    type="password"
                                    variant="outlined"
                                    fullWidth 
                                    className = "customInput"
                                    style={{ margin: "4px 0px"}} 
                                    onChange={(e) => this.changeHandler(e)}/>
                                <Button
                                    variant="contained" 
                                    color="primary" 
                                    type="submit"
                                    fullWidth
                                    style={{ margin: "4px 0px"}} 
                                    endIcon = {context.signinInProgress && <CircularProgress style = {{color: "#FFFFFF"}} size={20}/>}>
                                        sign in
                                </Button>
                                <Typography variant = "h6">Need an account? <Link to = "/signup">Sign Up</Link></Typography>
                            </form>                         
                        </Paper>
                    </Grid>
                    :
                    <Redirect to = "/"/>)
            }}
            </AuthConsumer>
        )
    }
}

export default SignIn
