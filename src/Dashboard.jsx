import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { collection, getDocs } from 'firebase/firestore'; // Firebase functions
import { db } from './firebaseConfig'; // Import Firestore

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch data from Firestore collection "products"
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
      backgroundColor: 'gray', // White background
      color: '#333333', // Dark grey text color
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '750px',
      margin: 'auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Grey shadow
    },
    heading: {
      textAlign: 'center',
      color: '#000000', // Black heading color
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    imageFlexContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      margin: '20px 0',
    },
    carouselImage: {
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '50%',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Grey shadow
      border: '4px solid #F5F5DC', // Beige border
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: 'green', // Beige background
      color: '#000000', // Black text
      textAlign: 'left',
      padding: '8px',
    },
    tableRow: {
      borderBottom: '1px solid #CCCCCC', // Light grey border
    },
    tableData: {
      padding: '8px',
      color: '#333333', // Dark grey text
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
          <Bar dataKey="quantity" fill="#BEBEBE" /> {/* Grey bar color */}
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
