import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const data = await registerUser(name, email, password, phone);
      setMessage('Registration successful!');
      // Store token in localStorage or cookie
      localStorage.setItem('token', data.token);
      navigate('/bookings-home');

    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Phone (optional):</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
