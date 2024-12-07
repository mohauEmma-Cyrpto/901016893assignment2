import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase
import { auth } from './firebaseConfig'; // Import your Firebase authentication instance

const Logout = ({ onLogout }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      // Firebase Logout: Sign out from Firebase Authentication
      await signOut(auth);

      // Trigger the logout action in the parent component
      onLogout();

      // Redirect to the sign-up page or login page after successful logout
      navigate('/signup'); // Adjust the route according to your setup
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  // Internal styles for the logout button
  const buttonStyle = {
    backgroundColor: '#F5F5DC',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#e68900',
  };

  // Style for positioning the logout button
  const logoutContainerStyle = {
    position: 'absolute', // Absolute positioning
    top: '20px', // Change the value to adjust vertical position
    right: '20px', // Change the value to adjust horizontal position
    zIndex: '1000', // Ensures the button is on top of other elements
  };

  return (
    <div className="logout" style={logoutContainerStyle}>
      <button
        onClick={handleLogout}
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
