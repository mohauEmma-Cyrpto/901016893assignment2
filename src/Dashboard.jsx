import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { collection, getDocs } from 'firebase/firestore'; // Firebase functions
import { db } from './firebaseConfig'; // Import Firestore
import ProductForm from './ProductForm';

import food1 from './assets/food1.jpg';
import food2 from './assets/food2.jpg';
import food3 from './assets/food3.jpg';
import food4 from './assets/food4.jpg';
import food5 from './assets/food5.jpg';
import food6 from './assets/food6.jpg';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);

  const images = [food1, food2, food3, food4, food5, food6];

  // Fetch products from Firebase Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map((doc) => doc.data());
        setProducts(productList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const selectedImages = products.slice(0, 3).map((_, index) => {
        const imageIndex = index % images.length;
        return images[imageIndex];
      });
      setCurrentImages(selectedImages);
    }
  }, [products]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const graphData = products.map((product) => ({
    name: product.name,
    quantity: product.quantity,
  }));

  const styles = { 
    dashboard: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9', 
      color: '#333333',
      padding: '30px',
      borderRadius: '12px',
      maxWidth: '900px',
      margin: 'auto',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', 
    },
    heading: {
      textAlign: 'center',
      color: '#e67e22', 
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
    },
    imageFlexContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '25px',
      margin: '30px 0',
      flexWrap: 'wrap', 
    },
    carouselImage: {
      width: '180px',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '50%',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
      border: '4px solid #F5A623',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '30px',
      backgroundColor: '#ffffff', 
    },
    tableHeader: {
      backgroundColor: '#f39c12', 
      color: '#ffffff',
      textAlign: 'left',
      padding: '12px',
      fontSize: '1.1rem',
    },
    tableRow: {
      borderBottom: '1px solid #eeeeee',
    },
    tableData: {
      padding: '12px',
      color: '#333333',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Dashboard - Current Stock Levels</h2>

      <div style={styles.chartContainer}>
        <BarChart width={700} height={400} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#CCCCCC" />
          <XAxis dataKey="name" stroke="#000000" />
          <YAxis stroke="#000000" />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#BEBEBE" />
        </BarChart>
      </div>

      <div style={styles.imageFlexContainer}>
        {currentImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Food ${index + 1}`}
            style={styles.carouselImage}
          />
        ))}
      </div>

      {/* Remove the add product functionality */}
      <ProductForm /> {/* No functionality for adding products */}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Product Name</th>
            <th style={styles.tableHeader}>Quantity in Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index} style={styles.tableRow}>
                <td style={styles.tableData}>{product.name}</td>
                <td style={styles.tableData}>{product.quantity}</td>
              </tr>
            ))
          ) : (
            <tr style={styles.tableRow}>
              <td colSpan="2" style={{ ...styles.tableData, textAlign: 'center' }}>
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
