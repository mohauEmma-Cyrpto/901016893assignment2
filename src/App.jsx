import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import UserManagement from "./UserManagement";
import Logout from "./Logout";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./App.css";
import { auth, signOut } from "./firebaseConfig";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in when the app loads or refreshes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // No user is logged in
      }
    });

    // Clean up the subscription when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleSignIn = (user) => {
    setUser(user);
  };

  const handleSignUp = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear the user state on logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Wings Cafe Stock Inventory System</h1>
        </header>

        {!user ? (
          <Routes>
            <Route path="/" element={<SignIn onSignIn={handleSignIn} />} />
            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <>
            <Logout onLogout={handleLogout} />
            <nav>
              <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/product-form">Add Product</Link></li>
                <li><Link to="/product-list">Product List</Link></li>
                <li><Link to="/user-management">User Management</Link></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product-form" element={<ProductForm />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
