import React, { useState } from 'react';
import './App.css'; // Make sure to create this CSS file


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch(
      'http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setMessage(data.message || data.error);
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setMessage(data.message || data.error);
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  const response = await fetch('http://localhost:5000/api/testdb');
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  console.log('DB Connection Test:', data);
  } catch (error) {
  console.error('Connection test failed:', error);
  setMessage("Failed to connect to the database.");
  }
};


  return (
    <div className="main-container">
      <div className="login-container">
        <div className="form-container">
          <div className="logo-container">
            <div className="logo">✦</div>
          </div>
              
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>Must be at least 8 characters</small>
            </div>
            
            <button className="create-account-btn" onClick={handleRegister}>
              Create account
            </button>
            
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            
            <button className="test-db-btn" onClick={handleSubmit}>
              Test DB Connection
            </button>
          </form>
          
          <div className="login-link">
            Been here before? <a href="#" onClick={handleLogin}>Log in</a>
          </div>
          
          {message && <p className="message">{message}</p>}
        </div>
        
        <div className="visual-section">
          <div className="visual-content">
            <div className="decoration-circle"></div>
            <h2>Profile Creation / Sign In</h2>
            <p>Welcome to our platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
