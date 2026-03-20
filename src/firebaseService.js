import { db } from "./firebase";
import { collection, doc, getDocs, addDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";

const COL = { regions:"regions", localites:"localites", eglises:"eglises", members:"members", reports:"reports", lessons:"lessons", grades:"grades" };
const snap2arr = (snap) => snap.docs.map(d => ({ id: d.id, ...d.data() }));

export function subscribeAll(callback) {
  const unsubs = [];
  const state = { regions:[], localites:[], eglises:[], members:[], reports:[], lessons:[], grades:[] };
  const notify = () => callback({ ...state });
  Object.keys(COL).forEach(key => {
    unsubs.push(onSnapshot(collection(db, COL[key]), snap => { state[key] = snap2arr(snap); notify(); }));
  });
  return () => unsubs.forEach(u => u());
}

export async function seedIfEmpty() {
  const snap = await getDocs(collection(db, COL.regions));
  if (snap.size > 0) return;
  const batch = writeBatch(db);
  const r1=doc(collection(db,COL.regions));const r2=doc(collection(db,COL.regions));
  batch.set(r1,{name:"Région Dakar",leader:"Frère Mbaye",createdDate:"2023-03-15"});
  batch.set(r2,{name:"Région Thiès",leader:"Frère Diagne",createdDate:"2024-09-01"});
  const l1=doc(collection(db,COL.localites));const l2=doc(collection(db,COL.localites));const l3=doc(collection(db,COL.localites));
  batch.set(l1,{regionId:r1.id,name:"Localité Plateau",leader:"Frère Diop",createdDate:"2023-06-01"});
  batch.set(l2,{regionId:r1.id,name:"Localité Parcelles Assainies",leader:"Frère Tall",createdDate:"2024-06-01"});
  batch.set(l3,{regionId:r2.id,name:"Localité Thiès Centre",leader:"Frère Ba",createdDate:"2024-10-01"});
  const e1=doc(collection(db,COL.eglises));const e2=doc(collection(db,COL.eglises));const e3=doc(collection(db,COL.eglises));const e4=doc(collection(db,COL.eglises));
  batch.set(e1,{localiteId:l1.id,name:"Église de Maison Plateau Centre",leader:"Sœur Ndiaye",createdDate:"2023-06-15"});
  batch.set(e2,{localiteId:l1.id,name:"Église de Maison Médina",leader:"Frère Sarr",createdDate:"2024-01-10"});
  batch.set(e3,{localiteId:l2.id,name:"Église de Maison Parcelles U14",leader:"Sœur Cissé",createdDate:"2024-07-15"});
  batch.set(e4,{localiteId:l3.id,name:"Église de Maison Thiès Nord",leader:"Frère Mboup",createdDate:"2024-11-01"});
  [["La Nouvelle Naissance","Fondement de la vie chrétienne"],["L'Assurance du Salut","Certitude de notre salut en Christ"],["Le Baptême d'Eau","Signification et importance du baptême"],["Le Saint-Esprit","La personne et l'œuvre du Saint-Esprit"],["La Prière","Communion avec Dieu par la prière"],["La Parole de Dieu","Étude et méditation des Écritures"],["L'Église","Le corps de Christ et la vie communautaire"],["Le Service","Servir Dieu et les frères"]].forEach(([t,d],i)=>{batch.set(doc(collection(db,COL.lessons)),{number:i+1,title:t,description:d});});
  await batch.commit();
}

export const addRegion=(data)=>addDoc(collection(db,COL.regions),{...data,createdDate:new Date().toISOString().slice(0,10)});
export const addLocalite=(data)=>addDoc(collection(db,COL.localites),{...data,createdDate:new Date().toISOString().slice(0,10)});
export const addEglise=(data)=>addDoc(collection(db,COL.eglises),{...data,createdDate:new Date().toISOString().slice(0,10)});
export const addMember=(data)=>addDoc(collection(db,COL.members),{...data,joinDate:new Date().toISOString().slice(0,10)});
export const addReport=(data)=>addDoc(collection(db,COL.reports),data);
export const addLesson=(data)=>addDoc(collection(db,COL.lessons),data);
export const addGrade=(data)=>addDoc(collection(db,COL.grades),{...data,date:new Date().toISOString().slice(0,10)});

export const deleteReport=(id)=>deleteDoc(doc(db,COL.reports,id));
export async function deleteEglise(id){const b=writeBatch(db);const ms=await getDocs(collection(db,COL.members));ms.docs.filter(m=>m.data().egliseId===id).forEach(m=>b.delete(m.ref));const rs=await getDocs(collection(db,COL.reports));rs.docs.filter(r=>r.data().egliseId===id).forEach(r=>b.delete(r.ref));const mIds=new Set(ms.docs.filter(m=>m.data().egliseId===id).map(m=>m.id));const gs=await getDocs(collection(db,COL.grades));gs.docs.filter(g=>mIds.has(g.data().memberId)).forEach(g=>b.delete(g.ref));b.delete(doc(db,COL.eglises,id));await b.commit();}
export async function deleteMember(id){const b=writeBatch(db);const gs=await getDocs(collection(db,COL.grades));gs.docs.filter(g=>g.data().memberId===id).forEach(g=>b.delete(g.ref));b.delete(doc(db,COL.members,id));await b.commit();}
export async function deleteLocalite(id){const es=await getDocs(collection(db,COL.eglises));for(const e of es.docs){if(e.data().localiteId===id)await deleteEglise(e.id);}await deleteDoc(doc(db,COL.localites,id));}
export async function deleteRegion(id){const ls=await getDocs(collection(db,COL.localites));for(const l of ls.docs){if(l.data().regionId===id)await deleteLocalite(l.id);}await deleteDoc(doc(db,COL.regions,id));}
