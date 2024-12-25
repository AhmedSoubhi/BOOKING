// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // This calls your backend /auth/login
      const data = await loginUser(email, password);
      // data should have { token, user: { id, email, ... } }
      setMessage('Login successful!');

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      // Also store user email
      localStorage.setItem('userEmail', data.user.email);

      // Navigate to bookings-home
      navigate('/bookings-home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="switch-text">
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
