import React, { useState } from "react";
import "./mobile.css";
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
          <div style={{fontSize:20}}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const handleLogout = async () => {
    localStorage.removeItem("cmci_access");
    await logout();
  };

  const btnStyle = (active) => ({
    padding:"6px 12px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:12, fontWeight:600, whiteSpace:"nowrap",
    background: active ? "#fff" : "rgba(255,255,255,0.15)",
    color: active ? "#1a3a5c" : "#fff"
  });

  return (
    <div style={{minHeight:"100vh",background:"#f0f2f5"}}>
      <div className="top-bar">
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span>⛪</span>
          <strong style={{fontSize:14}}>CMCI Sénégal</strong>
          {accessLabel && <span style={{opacity:0.7,fontSize:11}}>| {accessLabel}</span>}
        </div>
        <div className="top-bar-btns">
          {isAdmin && (
            <>
              <button style={btnStyle(adminPanel==="codes")} onClick={()=>setAdminPanel(adminPanel==="codes"?null:"codes")}>
                🔑 Codes
              </button>
              <button style={btnStyle(adminPanel==="users")} onClick={()=>setAdminPanel(adminPanel==="users"?null:"users")}>
                👥 Users
              </button>
              <button style={btnStyle(!adminPanel)} onClick={()=>setAdminPanel(null)}>
                📊 App
              </button>
            </>
          )}
          <button style={{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.3)",
            background:"transparent",color:"#fff",cursor:"pointer",fontSize:12}} onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 12px"}}>
        {adminPanel === "codes" && <AdminCodes />}
        {adminPanel === "users" && <AdminUsers />}
        {!adminPanel && <AppMain />}
      </div>
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
