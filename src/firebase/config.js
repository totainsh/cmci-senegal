import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAXu8WpsODR2dbiQKjNl93lUZpbOFSgi6Q",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cmci-senegal.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cmci-senegal",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cmci-senegal.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "54938884777",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:54938884777:web:f7205a74cf3f10230ea7b8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
