import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export async function register(email, password, displayName, role = "membre", extraData = {}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await setDoc(doc(db, "users", cred.user.uid), {
    email, displayName, role, ...extraData,
    createdAt: serverTimestamp(), active: true,
  });
  return cred.user;
}

export async function login(email, password) {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export async function logout() { return signOut(auth); }

export async function resetPassword(email) { return sendPasswordResetEmail(auth, email); }

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function onAuthChange(callback) { return onAuthStateChanged(auth, callback); }

export function isAdmin(profile) { return profile?.role === "admin"; }
