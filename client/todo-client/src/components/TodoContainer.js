import React, { Component } from 'react'
import Masonry from 'react-masonry-css'
import Cookies from 'universal-cookie';
import { Dialog, Grid, Typography } from '@material-ui/core'

import AuthContext from '../Utils/AuthContext'

import Todo from './Todo'
import TodoDetails from './TodoDetails'

import emptylist from './assets/emptylist.png'

class TodoContainer extends Component {
    static contextType = AuthContext
    constructor() {
        super()
        this.state = {
            openTodo: false,
            openTodoId: null
        }
    }
        
    deleteTodoHandler = (e,id) => {
        e.stopPropagation();
      
        fetch(`/todos/${id}`,
        {
            method: "delete",
            headers: {"accessToken": new Cookies().get("accessToken")}
        })
        .then(async (resp) => {
            if(resp.status === 200) this.closeTodoHandler(true);
            else
            {
                const status = await this.context.refresh()
                if(status == 200) this.deleteTodoHandler(e,id)
            }
            
        })
        .catch((e) => {
            console.log(e)
        })
    }

    openTodoHandler = (id) => this.setState({openTodo: true,openTodoId: id})
    
    closeTodoHandler = (fetchTodos) => 
    {
        this.setState({openTodo: false},()=>{
            if(fetchTodos)
                this.props.fetchTodos()
        })
        
    }
    render() {
        const breakpoints = {
            default: 4,
            1100: 3,
            700: 2,
            400: 1
        }
        return (
            this.props.todos.length > 0 ?
            <>
            <Masonry
                breakpointCols={breakpoints}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {this.props.todos.map((todo) => {
                    return  <Todo key = {todo._id} data = {todo} deleteTodoHandler = {this.deleteTodoHandler} openTodoHandler = {this.openTodoHandler} />
                })}
            </Masonry>
            <Dialog open = {this.state.openTodo} fullWidth maxWidth="sm" >
                <TodoDetails
                    closeTodoHandler = {this.closeTodoHandler}
                    todoId = {this.state.openTodoId}
                    deleteTodoHandler = {this.deleteTodoHandler}
                />
            </Dialog>
            </>
            :
            <Grid container justify="center" alignItems="center" direction = "column" style = {{height:"100%"}}>
                <Grid item>
                    <img src = {emptylist} width = {100}/>
                </Grid>
                <Grid item>
                    <Typography variant = "h4">No To-dos</Typography>
                </Grid>
            </Grid>
            
            
        )
    }
}

export default TodoContainer
