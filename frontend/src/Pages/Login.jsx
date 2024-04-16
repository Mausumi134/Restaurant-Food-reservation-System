import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password); 
    }

    return (
        <div className="app-container"> 
           
                <div className="auth-form-container">
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="youremail@gmail.com" 
                            id="email" 
                            name="email" 
                        />
                        <label htmlFor="password">Password</label>
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            placeholder="********" 
                            id="password" 
                            name="password" 
                        />
                        <Link to={"/home"}>
                            <button type="submit">Log In</button>
                        </Link>
                    </form>
                    <Link to={"/register"}>
                        <button className="link-btn" onClick={() => props.onFormSwitch('register')}>
                            Don't have an account? Register here.
                        </button>
                    </Link>
                </div>
           
        </div>
    );
}

export default Login;
