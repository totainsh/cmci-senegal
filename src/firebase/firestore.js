import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, writeBatch,
} from "firebase/firestore";
import { db } from "./config";

const snap = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }));

// RÉGIONS
export const regionsRef = collection(db, "regions");
export async function getRegions() { return snap(await getDocs(query(regionsRef, orderBy("name")))); }
export async function addRegion(data) { return addDoc(regionsRef, { ...data, createdAt: serverTimestamp() }); }
export async function updateRegion(id, data) { return updateDoc(doc(db, "regions", id), { ...data, updatedAt: serverTimestamp() }); }
export async function deleteRegion(id) { return deleteDoc(doc(db, "regions", id)); }
export function onRegions(cb) { return onSnapshot(query(regionsRef, orderBy("name")), (s) => cb(snap(s))); }

// LOCALITÉS
export const localitesRef = collection(db, "localites");
export async function getLocalites(regionId) {
  const q = regionId ? query(localitesRef, where("regionId", "==", regionId), orderBy("name")) : query(localitesRef, orderBy("name"));
  return snap(await getDocs(q));
}
export async function addLocalite(data) { return addDoc(localitesRef, { ...data, createdAt: serverTimestamp() }); }
export async function updateLocalite(id, data) { return updateDoc(doc(db, "localites", id), { ...data, updatedAt: serverTimestamp() }); }
export async function deleteLocalite(id) { return deleteDoc(doc(db, "localites", id)); }
export function onLocalites(regionId, cb) {
  const q = regionId ? query(localitesRef, where("regionId", "==", regionId), orderBy("name")) : query(localitesRef, orderBy("name"));
  return onSnapshot(q, (s) => cb(snap(s)));
}

// ÉGLISES DE MAISON
export const eglisesRef = collection(db, "eglises");
export async function getEglises(localiteId) {
  const q = localiteId ? query(eglisesRef, where("localiteId", "==", localiteId), orderBy("name")) : query(eglisesRef, orderBy("name"));
  return snap(await getDocs(q));
}
export async function addEglise(data) { return addDoc(eglisesRef, { ...data, createdAt: serverTimestamp() }); }
export async function updateEglise(id, data) { return updateDoc(doc(db, "eglises", id), { ...data, updatedAt: serverTimestamp() }); }
export async function deleteEglise(id) { return deleteDoc(doc(db, "eglises", id)); }
export function onEglises(localiteId, cb) {
  const q = localiteId ? query(eglisesRef, where("localiteId", "==", localiteId), orderBy("name")) : query(eglisesRef, orderBy("name"));
  return onSnapshot(q, (s) => cb(snap(s)));
}

// MEMBRES
export const membresRef = collection(db, "membres");
export async function getMembres(egliseId) {
  const q = egliseId ? query(membresRef, where("egliseId", "==", egliseId), orderBy("name")) : query(membresRef, orderBy("name"));
  return snap(await getDocs(q));
}
export async function addMembre(data) { return addDoc(membresRef, { ...data, createdAt: serverTimestamp(), active: true }); }
export async function updateMembre(id, data) { return updateDoc(doc(db, "membres", id), { ...data, updatedAt: serverTimestamp() }); }
export async function deleteMembre(id) { return updateDoc(doc(db, "membres", id), { active: false, deletedAt: serverTimestamp() }); }
export function onMembres(egliseId, cb) {
  const q = egliseId ? query(membresRef, where("egliseId", "==", egliseId), where("active", "==", true), orderBy("name")) : query(membresRef, where("active", "==", true), orderBy("name"));
  return onSnapshot(q, (s) => cb(snap(s)));
}

// RAPPORTS
export const rapportsRef = collection(db, "rapports");
export async function getRapports(egliseId) { return snap(await getDocs(query(rapportsRef, where("egliseId", "==", egliseId), orderBy("date", "desc")))); }
export async function addRapport(data) { return addDoc(rapportsRef, { ...data, createdAt: serverTimestamp() }); }
export async function updateRapport(id, data) { return updateDoc(doc(db, "rapports", id), { ...data, updatedAt: serverTimestamp() }); }
export function onRapports(egliseId, cb) { return onSnapshot(query(rapportsRef, where("egliseId", "==", egliseId), orderBy("date", "desc")), (s) => cb(snap(s))); }

// LEÇONS
export const leconsRef = collection(db, "lecons");
export async function getLecons() { return snap(await getDocs(query(leconsRef, orderBy("order")))); }
export async function addLecon(data) { return addDoc(leconsRef, { ...data, createdAt: serverTimestamp() }); }
export async function updateLecon(id, data) { return updateDoc(doc(db, "lecons", id), { ...data, updatedAt: serverTimestamp() }); }

// PROGRESSIONS
export const progressionsRef = collection(db, "progressions");
export async function getProgressions(membreId) { return snap(await getDocs(query(progressionsRef, where("membreId", "==", membreId), orderBy("date", "desc")))); }
export async function addProgression(data) { return addDoc(progressionsRef, { ...data, createdAt: serverTimestamp() }); }

// DÎMES
export const dimesRef = collection(db, "dimes");
export async function getDimes(egliseId, month) {
  let q = query(dimesRef, where("egliseId", "==", egliseId));
  if (month) q = query(q, where("month", "==", month));
  return snap(await getDocs(q));
}
export async function addDime(data) { return addDoc(dimesRef, { ...data, createdAt: serverTimestamp() }); }

// STATS
export async function getStats() {
  const [regions, localites, eglises, membres, rapports] = await Promise.all([
    getDocs(regionsRef), getDocs(localitesRef), getDocs(eglisesRef),
    getDocs(query(membresRef, where("active", "==", true))), getDocs(rapportsRef),
  ]);
  return { totalRegions: regions.size, totalLocalites: localites.size, totalEglises: eglises.size, totalMembres: membres.size, totalRapports: rapports.size };
}
