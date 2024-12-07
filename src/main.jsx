import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'; // Firebase module to initialize the app
import { getAuth } from 'firebase/auth'; // Firebase authentication module

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHdPQ_cnddwTKGBU9kV_3xHZ4U_B5CE3M",
  authDomain: "assignment-2-29d3c.firebaseapp.com",
  projectId: "assignment-2-29d3c",
  storageBucket: "assignment-2-29d3c.firebasestorage.app",
  messagingSenderId: "946980919381",
  appId: "1:946980919381:web:048a07e06b79e61f835cdc",
  measurementId: "G-67C38R5EKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Now the Firebase app and authentication are initialized and can be used throughout the app

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
