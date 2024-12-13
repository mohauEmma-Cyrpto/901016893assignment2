import React, { useState } from 'react';
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
    padding: '30px',
    backgroundColor: '#fff5e1', // A soft, creamy background resembling fried chicken
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Softer shadow for depth
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  header: {
    fontSize: '28px',
    textAlign: 'center',
    color: '#d35400', // A warm, crispy orange-red color
    marginBottom: '25px', // More space between header and form for balance
    fontWeight: 'bold',
    textTransform: 'uppercase', // Giving it a more bold and attention-grabbing feel
  },
  input: {
    padding: '14px',
    margin: '10px 0',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff3e0', // Light fried chicken golden color
    color: '#333',
    outline: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // Softer shadow for focus effect
  },
  submitButton: {
    padding: '14px 20px',
    backgroundColor: '#f39c12', // Golden fried chicken color
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#e67e22', // Darker fried chicken color on hover
  },
  successMessage: {
    marginTop: '20px',
    padding: '14px',
    backgroundColor: '#27ae60', // Fried chicken store success color
    color: '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: '20px',
    padding: '14px',
    backgroundColor: '#e74c3c', // Red for error messages
    color: '#fff',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};


export default ProductForm;
