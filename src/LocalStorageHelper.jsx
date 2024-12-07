import { db } from './firebaseConfig'; // Import Firestore functions from firebaseConfig
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// Save data to Firestore
export const saveToFirebase = async (key, value) => {
  try {
    const docRef = doc(db, 'storage', key); // Reference to Firestore document
    await setDoc(docRef, { data: value }); // Save the value in a "data" field
    console.log('Data saved to Firebase!');
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
};

// Get data from Firestore
export const getFromFirebase = async (key) => {
  try {
    const docRef = doc(db, 'storage', key); // Reference to Firestore document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data('currentUser').data; // Return the "data" field
    } else {
      console.log(`No document found with key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting data from Firebase:', error);
    return null;
  }
};

// Remove data from Firestore
export const removeFromFirebase = async (key) => {
  try {
    const docRef = doc(db, 'storage', key); // Reference to Firestore document
    await deleteDoc(docRef); // Delete the document
    console.log('Data removed from Firebase!');
  } catch (error) {
    console.error('Error removing data from Firebase:', error);
  }
};