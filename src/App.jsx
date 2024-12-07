import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import UserManagement from './UserManagement';
import SignIn from './SignIn';
import Login from './Login';
import Logout from './Logout';
import './App.css';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      await setDoc(doc(db, 'users', loggedInUser.uid), { lastLogin: new Date() }, { merge: true });
      setUser(loggedInUser);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        uid: newUser.uid,
      });

      setUser(newUser);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoginView(true);
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
          isLoginView ? (
            <SignIn onSignIn={handleSignIn} />
          ) : (
            <Login onSignUp={handleSignUp} />
          )
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
