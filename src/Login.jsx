import React, { useState } from 'react';
import './Login.css'; 
import { auth } from './firebaseConfig'; // Import auth from Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase method for login

function Login({ onLogin, goToSignUp }) {
  const [email, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for success message

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase Authentication - Sign In
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the authenticated user

      setMessage('Login successful!');
      setTimeout(() => {
        onLogin(user); // Pass the user to the parent component
        setMessage(''); // Clear the message
      }, 1000);
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login"> {/* Apply login class for styling */}
      <h2>Login</h2>
      {message && <div className="success-message">{message}</div>} {/* Display success message */}
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Back to Sign In Page Button */}
      <button className="bupack-to-sign-" onClick={goToSignUp}>
        Back to Sign Up Page
      </button>
    </div>
  );
}

export default Login;
