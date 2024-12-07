import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, addDoc  } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDHdPQ_cnddwTKGBU9kV_3xHZ4U_B5CE3M",
  authDomain: "assignment-2-29d3c.firebaseapp.com",
  projectId: "assignment-2-29d3c",
  storageBucket: "assignment-2-29d3c.firebasestorage.app",
  messagingSenderId: "946980919381",
  appId: "1:946980919381:web:048a07e06b79e61f835cdc",
  measurementId: "G-67C38R5EKM"
  };

  
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app); 
export const auth = getAuth(app);


export { addDoc, collection, getDocs, deleteDoc, doc, updateDoc };
export {  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };