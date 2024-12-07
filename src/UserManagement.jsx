import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from './firebaseConfig'; // Import Firestore methods
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userDocs = await getDocs(usersCollection);
      const userList = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const usersCollection = collection(db, 'users');
      const docRef = await addDoc(usersCollection, {
        name: user.name,
        password: user.password, // In production, do not store passwords like this
      });
      setUsers([...users, { id: docRef.id, ...user }]);
      setUser({ name: '', password: '' });
      setMessage('User added successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter((user) => user.id !== id));
      setMessage('User deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  const editUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setUser({ name: userToEdit.name, password: userToEdit.password });
    setIsEditing(true);
    setCurrentUserId(id);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const userDoc = doc(db, 'users', currentUserId);
      await updateDoc(userDoc, {
        name: user.name,
        password: user.password, // Do not store plain passwords
      });
      setUsers(users.map((u) => (u.id === currentUserId ? { id: currentUserId, ...user } : u)));
      setUser({ name: '', password: '' });
      setIsEditing(false);
      setCurrentUserId(null);
      setMessage('User updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating user');
    }
  };

  return (
    <div style={styles.userManagement}>
      <h2 style={styles.header}>User Management</h2>
      {message && <p style={styles.successMessage}>{message}</p>}

      <form onSubmit={isEditing ? handleUpdateUser : handleAddUser} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={user.name}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="User Password"
          value={user.password}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </form>

      <h3 style={styles.subHeader}>Current Users</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={styles.tableCell}>{u.name}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} onClick={() => editUser(u.id)}>
                  Edit
                </button>
                <button style={styles.actionButton} onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Internal styles
const styles = {
  userManagement: {
    backgroundColor: '#ffffff', // White background
    color: '#333333', // Dark grey text
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Grey shadow
  },
  header: {
    textAlign: 'center',
    color: '#000000', // Black heading color
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    padding: '10px',
    width: '80%',
    borderRadius: '4px',
    border: '1px solid #CCCCCC', // Light grey border
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#F5F5DC', // Beige button background
    color: '#333333', // Dark grey text
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successMessage: {
    textAlign: 'center',
    color: '#28a745', // Green for success
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    color: '#333333', // Dark grey sub-header text
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#F5F5DC', // Beige header background
    color: '#000000', // Black text
    padding: '10px',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #CCCCCC', // Light grey border
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#F5F5DC', // Beige button background
    color: '#000000', // Black text
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default UserManagement;
