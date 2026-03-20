import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  onRegions, addRegion as fbAddRegion, updateRegion as fbUpdateRegion, deleteRegion as fbDeleteRegion,
  onLocalites, addLocalite as fbAddLocalite, updateLocalite as fbUpdateLocalite, deleteLocalite as fbDeleteLocalite,
  onEglises, addEglise as fbAddEglise, updateEglise as fbUpdateEglise, deleteEglise as fbDeleteEglise,
  onMembres, addMembre as fbAddMembre, updateMembre as fbUpdateMembre, deleteMembre as fbDeleteMembre,
  onRapports, addRapport as fbAddRapport, updateRapport as fbUpdateRapport,
  getLecons, addLecon as fbAddLecon, getProgressions, addProgression as fbAddProgression,
  getStats, getDimes, addDime as fbAddDime,
} from "../firebase/firestore";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [regions, setRegions] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [eglises, setEglises] = useState([]);
  const [membres, setMembres] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [lecons, setLecons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLocalite, setSelectedLocalite] = useState(null);
  const [selectedEglise, setSelectedEglise] = useState(null);

  useEffect(() => { if (!user) return; const u = onRegions((d) => { setRegions(d); setLoading(false); }); return u; }, [user]);
  useEffect(() => { if (!user) return; return onLocalites(selectedRegion, setLocalites); }, [user, selectedRegion]);
  useEffect(() => { if (!user) return; return onEglises(selectedLocalite, setEglises); }, [user, selectedLocalite]);
  useEffect(() => { if (!user) return; return onMembres(selectedEglise, setMembres); }, [user, selectedEglise]);
  useEffect(() => { if (!user) return; if (!selectedEglise) { setRapports([]); return; } return onRapports(selectedEglise, setRapports); }, [user, selectedEglise]);
  useEffect(() => { if (!user) return; getLecons().then(setLecons).catch(console.error); }, [user]);

  const refreshStats = useCallback(async () => { if (!user) return; setStats(await getStats()); }, [user]);
  useEffect(() => { refreshStats(); }, [refreshStats]);

  const value = {
    regions, localites, eglises, membres, rapports, lecons, stats, loading,
    selectedRegion, selectedLocalite, selectedEglise,
    addRegion: async (d) => { await fbAddRegion(d); refreshStats(); },
    updateRegion: async (id, d) => { await fbUpdateRegion(id, d); },
    deleteRegion: async (id) => { await fbDeleteRegion(id); refreshStats(); },
    addLocalite: async (d) => { await fbAddLocalite(d); refreshStats(); },
    updateLocalite: async (id, d) => { await fbUpdateLocalite(id, d); },
    deleteLocalite: async (id) => { await fbDeleteLocalite(id); refreshStats(); },
    addEglise: async (d) => { await fbAddEglise(d); refreshStats(); },
    updateEglise: async (id, d) => { await fbUpdateEglise(id, d); },
    deleteEglise: async (id) => { await fbDeleteEglise(id); refreshStats(); },
    addMembre: async (d) => { await fbAddMembre(d); refreshStats(); },
    updateMembre: async (id, d) => { await fbUpdateMembre(id, d); },
    deleteMembre: async (id) => { await fbDeleteMembre(id); refreshStats(); },
    addRapport: async (d) => { await fbAddRapport(d); refreshStats(); },
    updateRapport: async (id, d) => { await fbUpdateRapport(id, d); },
    addLecon: async (d) => { await fbAddLecon(d); getLecons().then(setLecons); },
    getProgressions, addProgression: async (d) => { await fbAddProgression(d); },
    getDimes, addDime: async (d) => { await fbAddDime(d); },
    selectRegion: (id) => { setSelectedRegion(id); setSelectedLocalite(null); setSelectedEglise(null); },
    selectLocalite: (id) => { setSelectedLocalite(id); setSelectedEglise(null); },
    selectEglise: (id) => { setSelectedEglise(id); },
    clearFilters: () => { setSelectedRegion(null); setSelectedLocalite(null); setSelectedEglise(null); },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData doit être dans un DataProvider");
  return ctx;
}
