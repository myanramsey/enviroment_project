import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!responfise.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/testdb');
      const data = await response.json();
      console.log('DB Connection Test:', data);
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };
  
  // Add to your JSX:
  <button onClick={handleSubmit}>Test DB Connection</button>
  

  return (
    <div>
      <h1>User Authentication</h1>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
