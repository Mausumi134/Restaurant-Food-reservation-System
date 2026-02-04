import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/home");
    }
    
    setLoading(false);
  };

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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <Link to={"/register"}>
          <button className="link-btn">
            Don't have an account? Register here.
          </button>
        </Link>
        
        <div className="demo-credentials" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h6>Demo Customer Credentials:</h6>
          <p><strong>Customer 1:</strong> john@example.com / password123</p>
          <p><strong>Customer 2:</strong> jane@example.com / password123</p>
          <p><strong>Customer 3:</strong> mike@example.com / password123</p>
          <p><strong>Customer 4:</strong> sarah@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
