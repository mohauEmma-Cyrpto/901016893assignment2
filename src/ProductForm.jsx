import React, { useState } from 'react';
import './Productform.css'; 
import { db, addDoc, collection } from './firebaseConfig'; // Import Firestore methods

const ProductForm = ({ onFormSubmit }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!product.name || !product.description || !product.category || !product.price || !product.quantity) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Firestore: Add product to Firestore
      const productsCollection = collection(db, 'products'); // Reference to the 'products' collection
      await addDoc(productsCollection, product); // Add product to Firestore collection

      // Show success message
      setSuccessMessage('Product added successfully!');
      setProduct({ name: '', description: '', category: '', price: '', quantity: '' });
      onFormSubmit();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="product-form-container" style={styles.container}>
      <form className="product-form" onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Add New Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Initial Quantity"
          value={product.quantity}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Add Product</button>
      </form>

      {/* Success message */}
      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow for depth
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  header: {
    fontSize: '24px',
    textAlign: 'center',
    color: '#000',
    marginBottom: '20px', // space between header and form
  },
  input: {
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px', // rounded corners
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    color: '#000',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // light shadow for focus effect
  },
  submitButton: {
    padding: '12px 18px',
    backgroundColor: '#F5F5DC',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#cc8400',
  },
  successMessage: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#F5F5DC',
    color: '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  }
};

export default ProductForm;
