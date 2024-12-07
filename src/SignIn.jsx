import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebaseConfig'; // Import Firebase auth
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import './Signin.css';

const SignIn = ({ onSignIn }) => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between Sign Up and Log In
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Input Validation
    if (!user.email || !user.password) {
      setError('Email and password are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (user.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      let userCredential;
      if (isSignUp) {
        // Sign Up logic
        userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        setMessage('Sign-Up successful!');
      } else {
        // Log In logic
        userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
        setMessage('Login successful!');
      }

      // Get the user object from the userCredential
      const loggedInUser = userCredential.user;

      // Save user to Firestore
      await setDoc(doc(db, 'users', loggedInUser.uid), {
        email: loggedInUser.email,
        uid: loggedInUser.uid,
        createdAt: new Date(),
      });

      setUser({ email: '', password: '' });
      onSignIn(loggedInUser); // Notify parent component of successful sign-in
      navigate('/dashboard'); // Redirect to dashboard after successful login/signup
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="sign-in">
      <h3>{isSignUp ? 'Sign Up' : 'Log In'}</h3>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email || ''}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password || ''}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <div className="toggle-mode">
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
