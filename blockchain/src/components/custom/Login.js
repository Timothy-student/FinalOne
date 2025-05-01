import React, { Component } from 'react'
import axios from 'axios'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            loading: false,
            error: null
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            error: null
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        
        if (!username || !password) {
            this.setState({ error: 'Please fill in all fields' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const response = await axios.post('http://localhost:8000/api/adminLogin', {
                username: username,
                password: password,
            });

            if (response.data === true) {
                window.location.assign("/newelection");
            } else {
                this.setState({ 
                    error: 'Incorrect Username or Password',
                    loading: false 
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.setState({ 
                error: 'Error connecting to server. Please try again.',
                loading: false 
            });
        }
    }

    render(){
        const { loading, error } = this.state;
        
        return(
            <div className="container">
                <h4>Admin Login</h4>
                {error && (
                    <div className="card-panel red lighten-4" style={{marginTop: '20px'}}>
                        <span className="red-text text-darken-4">{error}</span>
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <div className="input-field">
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            onChange={this.handleInputChange} 
                            required
                            disabled={loading}
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-field">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            onChange={this.handleInputChange} 
                            required
                            disabled={loading}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button 
                        className="btn blue darken-2" 
                        type="submit" 
                        name="action"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>      
        )
    }
}

export default Login;