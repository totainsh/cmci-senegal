import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { db, auth } from "../../firebase/config";
import { login } from "../../firebase/auth";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCode = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "codes"), where("code", "==", code.trim().toUpperCase())));
      if (snap.empty) { setError("Code d'accès invalide"); setLoading(false); return; }
      const codeData = { id: snap.docs[0].id, ...snap.docs[0].data() };
      await signInAnonymously(auth);
      localStorage.setItem("cmci_access", JSON.stringify(codeData));
      window.location.reload();
    } catch (err) {
      setError("Erreur de connexion : " + err.message);
    } finally { setLoading(false); }
  };

  const handleAdmin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = { "auth/invalid-credential":"Email ou mot de passe incorrect", "auth/user-not-found":"Compte non trouvé" };
      setError(msg[err.code] || err.message);
    } finally { setLoading(false); }
  };

  const S = {
    page: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#1a3a5c 0%,#2a6496 50%,#1a3a5c 100%)", padding:20, fontFamily:"'Segoe UI',sans-serif" },
    card: { background:"#fff", borderRadius:16, padding:"40px 32px", maxWidth:420, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" },
    title: { fontSize:24, fontWeight:700, color:"#1a3a5c", textAlign:"center", margin:"8px 0 4px" },
    sub: { fontSize:14, color:"#666", textAlign:"center", marginBottom:24 },
    input: { width:"100%", padding:"14px 16px", border:"2px solid #e0e0e0", borderRadius:10, fontSize:16,
      marginBottom:14, boxSizing:"border-box", textAlign:"center", letterSpacing:2, textTransform:"uppercase" },
    inputNormal: { width:"100%", padding:"12px 16px", border:"2px solid #e0e0e0", borderRadius:10, fontSize:15, marginBottom:14, boxSizing:"border-box" },
    btn: { width:"100%", padding:14, background:"linear-gradient(135deg,#2a6496,#1a3a5c)", color:"#fff",
      border:"none", borderRadius:10, fontSize:16, fontWeight:600, cursor:"pointer", marginTop:8, opacity:loading?0.7:1 },
    err: { background:"#fee", color:"#c00", padding:"10px 14px", borderRadius:8, marginBottom:14, fontSize:14 },
    foot: { textAlign:"center", marginTop:20, fontSize:13, color:"#999" },
    link: { color:"#2a6496", cursor:"pointer", textDecoration:"underline", fontSize:13 },
    divider: { display:"flex", alignItems:"center", gap:12, margin:"20px 0", color:"#ccc" },
    line: { flex:1, height:1, background:"#e0e0e0" },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{textAlign:"center",fontSize:48}}>⛪</div>
        <div style={S.title}>CMCI Sénégal</div>
        <div style={S.sub}>Entrez votre code d'accès</div>
        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleCode}>
          <input style={S.input} placeholder="CODE D'ACCÈS" value={code}
            onChange={e=>setCode(e.target.value)} required maxLength={20}/>
          <button style={S.btn} disabled={loading}>{loading?"Vérification...":"Accéder"}</button>
        </form>

        <div style={S.foot}>
          <div style={{marginBottom:8}}>Contactez votre dirigeant pour obtenir votre code</div>
          <span style={S.link} onClick={()=>setShowAdmin(!showAdmin)}>
            {showAdmin ? "Fermer" : "Accès Administrateur"}
          </span>
        </div>

        {showAdmin && (<>
          <div style={S.divider}><div style={S.line}/><span style={{fontSize:12}}>ADMIN</span><div style={S.line}/></div>
          <form onSubmit={handleAdmin}>
            <input style={S.inputNormal} type="email" placeholder="Email admin" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <input style={S.inputNormal} type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} required/>
            <button style={S.btn} disabled={loading}>{loading?"Connexion...":"Connexion Admin"}</button>
          </form>
        </>)}
      </div>
    </div>
  );
}
