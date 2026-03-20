import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXu8MpsODR2dbiQKjNl93lUZpbOFSgi6Q",
  authDomain: "cmci-senegal.firebaseapp.com",
  projectId: "cmci-senegal",
  storageBucket: "cmci-senegal.firebasestorage.app",
  messagingSenderId: "54938884777",
  appId: "1:54938884777:web:f7205a74cf3f10230ea7b8",
  measurementId: "G-C89FM2XPXG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
