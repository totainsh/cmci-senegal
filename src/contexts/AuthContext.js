import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, getUserProfile } from "../firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        if (firebaseUser.isAnonymous) {
          const stored = localStorage.getItem("cmci_access");
          if (stored) setAccess(JSON.parse(stored));
          setProfile({ role: "code_user" });
        } else {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
          setAccess({ level: "national", label: "Admin" });
        }
      } else {
        setProfile(null);
        setAccess(null);
        localStorage.removeItem("cmci_access");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, profile, access, loading,
      isLoggedIn: !!user,
      isAdmin: profile?.role === "admin",
      isNational: access?.level === "national",
      accessLevel: access?.level,
      accessRegionId: access?.regionId,
      accessLocaliteId: access?.localiteId,
      accessEgliseId: access?.egliseId,
      accessLabel: access?.label,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être dans un AuthProvider");
  return ctx;
}
