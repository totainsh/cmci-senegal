import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminCodes() {
  const [codes, setCodes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code:"", level:"national", label:"", regionId:"", localiteId:"", egliseId:"" });
  const [regions, setRegions] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [eglises, setEglises] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const s = await getDocs(query(collection(db, "codes"), orderBy("level")));
    setCodes(s.docs.map(d=>({id:d.id,...d.data()})));
    setRegions((await getDocs(collection(db,"regions"))).docs.map(d=>({id:d.id,...d.data()})));
    setLocalites((await getDocs(collection(db,"localites"))).docs.map(d=>({id:d.id,...d.data()})));
    setEglises((await getDocs(collection(db,"eglises"))).docs.map(d=>({id:d.id,...d.data()})));
  };
  useEffect(()=>{load();},[]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = { code:form.code.toUpperCase().trim(), level:form.level, label:form.label, createdAt:serverTimestamp() };
    if(form.level==="region") data.regionId=form.regionId;
    if(form.level==="localite"){ data.localiteId=form.localiteId; data.regionId=form.regionId; }
    if(form.level==="eglise"){ data.egliseId=form.egliseId; data.localiteId=form.localiteId; data.regionId=form.regionId; }
    await addDoc(collection(db,"codes"), data);
    setMsg("Code créé : "+data.code);
    setForm({code:"",level:"national",label:"",regionId:"",localiteId:"",egliseId:""});
    load();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Supprimer ce code ?")){ await deleteDoc(doc(db,"codes",id)); load(); }
  };

  const levelLabel = {national:"🌍 National",region:"📍 Région",localite:"🏘️ Localité",eglise:"🏠 Église"};
  const levelColor = {national:"#1a3a5c",region:"#2a6496",localite:"#4a9aca",eglise:"#7ab8d4"};

  const S = {
    container:{padding:20},
    header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},
    title:{fontSize:20,fontWeight:700,color:"#1a3a5c"},
    addBtn:{padding:"10px 20px",background:"#2a6496",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600},
    form:{background:"#f8f9fa",padding:20,borderRadius:12,marginBottom:20},
    input:{width:"100%",padding:"10px 14px",border:"2px solid #e0e0e0",borderRadius:8,fontSize:14,marginBottom:12,boxSizing:"border-box"},
    select:{width:"100%",padding:"10px 14px",border:"2px solid #e0e0e0",borderRadius:8,fontSize:14,marginBottom:12,boxSizing:"border-box"},
    btn:{padding:"10px 20px",background:"#2a6496",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600},
    ok:{background:"#efe",color:"#060",padding:"10px 14px",borderRadius:8,marginBottom:14,fontSize:14},
    codeCard:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",
      background:"#fff",borderRadius:10,marginBottom:8,border:"1px solid #e0e0e0"},
    codeText:{fontFamily:"monospace",fontSize:18,fontWeight:700,letterSpacing:2},
    delBtn:{background:"#fee",color:"#c00",border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:13},
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={S.title}>Codes d'Accès</div>
        <button style={S.addBtn} onClick={()=>setShowForm(!showForm)}>{showForm?"✕ Fermer":"+ Nouveau Code"}</button>
      </div>
      {msg && <div style={S.ok}>{msg}</div>}
      {showForm && (
        <div style={S.form}>
          <form onSubmit={handleCreate}>
            <input style={{...S.input,textTransform:"uppercase",letterSpacing:2,fontSize:16,textAlign:"center"}}
              placeholder="CODE D'ACCÈS" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required/>
            <input style={S.input} placeholder="Libellé (ex: Direction Nationale, Région Dakar...)"
              value={form.label} onChange={e=>setForm({...form,label:e.target.value})} required/>
            <select style={S.select} value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
              <option value="national">National (accès total)</option>
              <option value="region">Région</option>
              <option value="localite">Localité</option>
              <option value="eglise">Église de maison</option>
            </select>
            {(form.level==="region"||form.level==="localite"||form.level==="eglise") && (
              <select style={S.select} value={form.regionId} onChange={e=>setForm({...form,regionId:e.target.value})}>
                <option value="">-- Choisir la région --</option>
                {regions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            )}
            {(form.level==="localite"||form.level==="eglise") && (
              <select style={S.select} value={form.localiteId} onChange={e=>setForm({...form,localiteId:e.target.value})}>
                <option value="">-- Choisir la localité --</option>
                {localites.filter(l=>l.regionId===form.regionId).map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            )}
            {form.level==="eglise" && (
              <select style={S.select} value={form.egliseId} onChange={e=>setForm({...form,egliseId:e.target.value})}>
                <option value="">-- Choisir l'église --</option>
                {eglises.filter(e=>e.localiteId===form.localiteId).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            )}
            <button style={S.btn}>Créer le code</button>
          </form>
        </div>
      )}
      {codes.length===0 && <div style={{textAlign:"center",padding:40,color:"#999"}}>Aucun code créé</div>}
      {codes.map(c=>(
        <div key={c.id} style={S.codeCard}>
          <div>
            <div style={S.codeText}>{c.code}</div>
            <div style={{fontSize:13,color:"#666",marginTop:4}}>{c.label}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{display:"inline-block",padding:"4px 10px",borderRadius:12,fontSize:12,fontWeight:600,
              background:levelColor[c.level]+"20",color:levelColor[c.level]}}>{levelLabel[c.level]}</span>
            <button style={S.delBtn} onClick={()=>handleDelete(c.id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}
