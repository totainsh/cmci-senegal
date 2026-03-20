import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import LoginPage from "./components/auth/LoginPage";
import AdminCodes from "./components/auth/AdminCodes";
import AdminUsers from "./components/auth/AdminUsers";
import AppMain from "./AppMain";
import { logout } from "./firebase/auth";

function AppContent() {
  const { user, profile, loading, isAdmin, accessLabel } = useAuth();
  const [adminPanel, setAdminPanel] = useState(null);

  if (loading) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",
        background:"linear-gradient(135deg,#1a3a5c,#2a6496)",color:"#fff",fontFamily:"'Segoe UI',sans-serif"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>⛪</div>
          <div style={{fontSize:20}}>Chargement CMCI Sénégal...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const handleLogout = async () => {
    localStorage.removeItem("cmci_access");
    await logout();
  };

  const S = {
    topBar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px",
      background:"#1a3a5c", color:"#fff", fontFamily:"'Segoe UI',sans-serif", fontSize:14 },
    adminBtns: { display:"flex", gap:8 },
    btn: (active) => ({ padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
      background: active ? "#fff" : "rgba(255,255,255,0.15)", color: active ? "#1a3a5c" : "#fff" }),
    logoutBtn: { padding:"6px 14px", borderRadius:6, border:"1px solid rgba(255,255,255,0.3)",
      background:"transparent", color:"#fff", cursor:"pointer", fontSize:13 },
  };

  return (
    <div>
      <div style={S.topBar}>
        <div>
          ⛪ <strong>CMCI Sénégal</strong>
          {accessLabel && <span style={{marginLeft:10,opacity:0.7}}>| {accessLabel}</span>}
          {profile?.displayName && <span style={{marginLeft:10,opacity:0.7}}>| {profile.displayName}</span>}
        </div>
        <div style={S.adminBtns}>
          {isAdmin && (
            <>
              <button style={S.btn(adminPanel==="codes")} onClick={()=>setAdminPanel(adminPanel==="codes"?null:"codes")}>
                🔑 Codes d'accès
              </button>
              <button style={S.btn(adminPanel==="users")} onClick={()=>setAdminPanel(adminPanel==="users"?null:"users")}>
                👥 Utilisateurs
              </button>
              <button style={S.btn(!adminPanel)} onClick={()=>setAdminPanel(null)}>
                📊 Application
              </button>
            </>
          )}
          <button style={S.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      {adminPanel === "codes" && <AdminCodes />}
      {adminPanel === "users" && <AdminUsers />}
      {!adminPanel && <AppMain />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
