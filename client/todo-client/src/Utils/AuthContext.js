import React, { Component } from 'react'
import Cookies from 'universal-cookie';

const AuthContext = React.createContext()
class AuthConsumer extends Component {
    render() {
        return (
            <AuthContext.Consumer>
                {this.props.children}
            </AuthContext.Consumer>
        )
    }
}
class AuthProvider extends Component{
    constructor()
    {
        super();
        this.state = {
            user: null,
            signUpError:"",
            signInError:"",
            isSignedIn: false,
            signinInProgress: false,
            signupInProgress: false,
            signup: this.signup,
            signout: this.signout,
            signin: this.signin,
            refresh: this.refresh
        }
        this.signup = this.signup.bind(this)
        this.signin = this.signin.bind(this)
        this.signout = this.signout.bind(this)
        this.refresh = this.refresh.bind(this)
  
    }
    componentDidMount() {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken')
        const user = cookies.get('user')
        this.setState({isSignedIn:accessToken!=null,user})
    }

    signup = (name,uname,pwd) =>
    {
        this.setState({signupInProgress: true},()=>{
            fetch("/auth/signup",
            {
                method: 'post',
                body: JSON.stringify({username: uname, password: pwd, name: name}),
                headers: {"Content-Type": "application/json"}
            })
            .then(async (resp) => 
            {
                let user = await resp.json()
                if(resp.status == 200)
                {
                    this.setState({
                        isSignedIn: true,
                        user: user,
                        signupInProgress: false
                    },()=>{
                        new Cookies().set("user",user)
                    })
                }
                else
                {
                    this.setState({
                        signUpError: user.message,
                        isSignedIn: false,
                        user: null,
                        signupInProgress: false
                    })
                }
            })
        })
    }
    
    signout = () =>
    {
        const cookies = new Cookies();
        cookies.remove("accessToken")
        cookies.remove("refreshToken")
        this.setState({
            isSignedIn: false,
            user: null
        })
    }

    signin = (uname,pwd) =>
    {
        this.setState({signinInProgress: true},()=>{
            fetch("/auth/signin",
            {
                method: 'post',
                body: JSON.stringify({username: uname, password:pwd}),
                headers: {"Content-Type": "application/json"}
            })
            .then(async (resp) => 
            {
                let user = await resp.json()
                if(resp.status == 200)
                {
                    this.setState({
                        isSignedIn: true,
                        user: user,
                        signinInProgress: false,
                    },()=>{
                        new Cookies().set("user",user)
                    })
                }
                else
                {
                    this.setState({
                        signInError: user.message,
                        isSignedIn: false,
                        user: null,
                        signinInProgress: false,
                    })
                }
            }) 
        })
        
          
    }

     refresh = async () =>{
        let status = 0
        await fetch('/auth/refresh',
        {
            method: 'post',
            headers: {"Content-Type": "application/json", "refreshToken":new Cookies().get("refreshToken")},
        })
        .then(async resp => {
            if(resp.status == 200)
            {
                console.log("New token received. Fetching data")
                status = 200
            }
            else
            {
                this.signout()
                const error = await resp.json()
                throw new Error(error.message)
            }
        })
        .catch(e =>{
            console.log(e)
            status = 400
        }) 
        return status
    }

    render() {
        return <AuthContext.Provider value = {this.state}>
            {this.props.children}
        </AuthContext.Provider>
    }

}

export {AuthProvider, AuthConsumer}
export default AuthContext
