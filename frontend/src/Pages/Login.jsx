import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Email validation for Gmail
        if (!email.includes('@') || !email.endsWith('@gmail.com')) {
            alert('Please enter a valid Gmail address');
            return;
        }

        // Password complexity criteria
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            alert('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and be at least 6 characters long');
            return;
        }

        // Authentication successful, navigate to home page
        navigate("/home");
        // Reset email and password fields
        setEmail('');
        setPassword('');
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
                    <button type="submit">Log In</button>
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
