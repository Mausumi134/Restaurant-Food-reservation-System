import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    passwordConf: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      navigate("/home");
    }
    
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="auth-form-container">
        <h2>Register</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            placeholder="John"
            id="firstName"
            name="firstName"
            required
          />
          
          <label htmlFor="lastName">Last Name</label>
          <input
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            placeholder="Doe"
            id="lastName"
            name="lastName"
            required
          />
          
          <label htmlFor="email">Email</label>
          <input
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
            required
          />
          
          <label htmlFor="username">Username</label>
          <input
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="johndoe"
            id="username"
            name="username"
            required
          />
          
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="+1234567890"
            id="phone"
            name="phone"
          />
          
          <label htmlFor="password">Password</label>
          <input
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="********"
            id="password"
            name="password"
            required
          />
          
          <label htmlFor="passwordConf">Confirm Password</label>
          <input
            value={formData.passwordConf}
            onChange={handleChange}
            type="password"
            placeholder="********"
            id="passwordConf"
            name="passwordConf"
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <Link to={"/"}>
          <button className="link-btn">Already have an account? Login here.</button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
