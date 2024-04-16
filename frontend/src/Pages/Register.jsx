import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password, name); 
    }

    return (
        <div className="app-container"> 
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    id="name" 
                    placeholder="Full Name" 
                    required
                />
                <label htmlFor="email">Email</label>
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="youremail@gmail.com" 
                    id="email" 
                    name="email" 
                    required
                />
                <label htmlFor="password">Password</label>
                <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="********" 
                    id="password" 
                    name="password" 
                    required
                />
                  <Link to={"/home"}>
                  <button type="submit">Register</button>
               </Link>
               
            </form>
            <Link to={"/"}>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>
                Already have an account? Login here.
            </button>
               </Link>
            
        </div>
        </div>
    );
}

export default Register;
