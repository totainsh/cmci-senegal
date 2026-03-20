import React, { useState, useEffect } from "react";
import { register } from "../../firebase/auth";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"membre" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    const snap = await getDocs(query(collection(db, "users"), orderBy("displayName")));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.role);
      setMsg(`Compte créé pour ${form.name} !`);
      setForm({ name:"", email:"", password:"", role:"membre" });
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const changeRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    loadUsers();
  };

  const S = {
    container: { padding:20 },
    header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 },
    title: { fontSize:20, fontWeight:700, color:"#1a3a5c" },
    addBtn: { padding:"10px 20px", background:"#2a6496", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 },
    form: { background:"#f8f9fa", padding:20, borderRadius:12, marginBottom:20 },
    input: { width:"100%", padding:"10px 14px", border:"2px solid #e0e0e0", borderRadius:8, fontSize:14, marginBottom:12, boxSizing:"border-box" },
    select: { width:"100%", padding:"10px 14px", border:"2px solid #e0e0e0", borderRadius:8, fontSize:14, marginBottom:12, boxSizing:"border-box" },
    row: { display:"flex", gap:10 },
    btn: { padding:"10px 20px", background:"#2a6496", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600 },
    cancelBtn: { padding:"10px 20px", background:"#ddd", color:"#333", border:"none", borderRadius:8, cursor:"pointer" },
    table: { width:"100%", borderCollapse:"collapse" },
    th: { textAlign:"left", padding:"10px 12px", borderBottom:"2px solid #e0e0e0", fontSize:13, color:"#666", fontWeight:600 },
    td: { padding:"10px 12px", borderBottom:"1px solid #f0f0f0", fontSize:14 },
    badge: (role) => ({
      display:"inline-block", padding:"3px 10px", borderRadius:12, fontSize:12, fontWeight:600,
      background: role==="admin"?"#fee2e2":role==="dirigeant"?"#fef3c7":"#e0f2fe",
      color: role==="admin"?"#991b1b":role==="dirigeant"?"#92400e":"#075985",
    }),
    roleSelect: { padding:"4px 8px", borderRadius:6, border:"1px solid #ddd", fontSize:13 },
    err: { background:"#fee", color:"#c00", padding:"10px 14px", borderRadius:8, marginBottom:14, fontSize:14 },
    ok: { background:"#efe", color:"#060", padding:"10px 14px", borderRadius:8, marginBottom:14, fontSize:14 },
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={S.title}>Gestion des Utilisateurs</div>
        <button style={S.addBtn} onClick={()=>setShowForm(!showForm)}>
          {showForm ? "✕ Fermer" : "+ Créer un compte"}
        </button>
      </div>

      {showForm && (
        <div style={S.form}>
          {error && <div style={S.err}>{error}</div>}
          {msg && <div style={S.ok}>{msg}</div>}
          <form onSubmit={handleCreate}>
            <input style={S.input} placeholder="Nom complet" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
            <input style={S.input} type="email" placeholder="Adresse email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            <input style={S.input} type="password" placeholder="Mot de passe (min 6 caractères)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={6}/>
            <select style={S.select} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="membre">Membre</option>
              <option value="dirigeant">Dirigeant</option>
              <option value="admin">Administrateur</option>
            </select>
            <div style={S.row}>
              <button style={S.btn} disabled={loading}>{loading?"Création...":"Créer le compte"}</button>
              <button type="button" style={S.cancelBtn} onClick={()=>setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Nom</th>
            <th style={S.th}>Email</th>
            <th style={S.th}>Rôle</th>
            <th style={S.th}>Changer le rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={S.td}>{u.displayName}</td>
              <td style={S.td}>{u.email}</td>
              <td style={S.td}><span style={S.badge(u.role)}>{u.role}</span></td>
              <td style={S.td}>
                <select style={S.roleSelect} value={u.role} onChange={e=>changeRole(u.id,e.target.value)}>
                  <option value="membre">Membre</option>
                  <option value="dirigeant">Dirigeant</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length===0 && <div style={{textAlign:"center",padding:40,color:"#999"}}>Aucun utilisateur pour le moment</div>}
    </div>
  );
}
