import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import { Box, Grid } from '@material-ui/core'
import { Redirect } from 'react-router';

import AuthContext, { AuthConsumer } from '../Utils/AuthContext';

import NewTodo from './NewTodo';
import TodoContainer from './TodoContainer';

class Home extends Component {
    static contextType = AuthContext
    constructor()
    {
        super()
        this.state = {
            todos: [],
            isSignedIn: new Cookies().get("accessToken") ? true : false,
            newTodoError: null
        }
        this._isMounted = false;
    }
    componentDidMount() 
    {
        this._isMounted = true;
        this._isMounted && this.fetchTodos() 
    }

    componentWillUnmount() {
        this._isMounted = false;
     }

    fetchTodos = async () =>
    {
        await fetch('/todos',{
            headers: {"accessToken": new Cookies().get("accessToken")},
        })
        .then(async (resp) =>{
            if(resp.status == 200)
            {
                const data = await resp.json()
                this._isMounted && this.setState({todos: data})
            }
            else if(resp.status == 401)
            {
                const status = await this.context.refresh()
                if(status == 200) this.fetchTodos()
            }
            else
            {
                const error = await resp.json()
                throw new Error(error.message)
            }
        })
        .catch(e =>{
            console.log(e)
        })
    }

    submitHandler = (data) => {
        fetch('/todos',{
            method : "post",
            headers: {"Content-Type": "application/json", "accessToken": new Cookies().get("accessToken")},
            body : JSON.stringify(data)
        })
        .then(async (resp) =>{
            if(resp.status == 200)
            {
                this.setState({newTodoError: null})
                this.fetchTodos()
            }
            else if(resp.status == 401)
            {
                const status = await this.context.refresh()
                if(status == 200) this.submitHandler(data)
            }
            else
            {
                const error = await resp.json()
                this.setState({newTodoError: error.message})
                throw new Error(error.message)
            }
        })
        .catch(e => {
            console.log(e)
        })
    }
    render() {
        return (
            <AuthConsumer>
            {
                (context) => {
                    return (!context.isSignedIn ?
                    <Redirect to = "/signin"/>
                    :
                    <Grid container spacing={0}>
                        <Box clone order = {{xs:0, md:0}} >
                        <Grid item sm = {false} lg = {1}></Grid>
                        </Box>
                        <Box clone order = {{xs : 2, md: 1}}>
                        <Grid item className = "todoContainer"  container xs = {12} sm = {12} md = {8} lg = {7} direction = "row" justify = "flex-start" align-items = "flex-start" style = {{border: "0px solid", padding: "12px", height: "fit-content"}}>
                            <TodoContainer  todos = {this.state.todos} fetchTodos = {this.fetchTodos}/>
                        </Grid>
                        </Box>
                        <Box clone order = {{xs:1, md:2}} >
                        <Grid item container xs = {12} md = {4} lg = {3} style = {{border: "0px solid",padding:"12px", height: "fit-content"}}>
                            <NewTodo submitHandler = {this.submitHandler} newTodoError = {this.state.newTodoError}/>
                        </Grid>
                        </Box>
                        <Box clone order = {{xs:3, md:3}} >
                        <Grid item sm = {false} lg = {1}></Grid> 
                        </Box>
                    </Grid>)
                }
            }          
        </AuthConsumer>  
        )
    }
}

export default Home