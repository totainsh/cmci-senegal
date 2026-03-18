import { useState, useCallback, useMemo } from "react";


const LOGO_SRC = "data:image/jpeg;base64,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";
const defaultData = {
  regions: [
    {
      id: "r1", name: "Région Dakar", leader: "Frère Mbaye",
      localites: [
        {
          id: "l1", name: "Localité Plateau", leader: "Frère Diop",
          eglises: [
            {
              id: "e1", name: "Église de Maison Plateau Centre", leader: "Sœur Ndiaye",
              members: [
                { id: "m1", name: "Jean Faye", phone: "77 123 4567", role: "Membre", joinDate: "2024-01-15" },
                { id: "m2", name: "Marie Diallo", phone: "78 234 5678", role: "Membre", joinDate: "2024-03-20" },
                { id: "m3", name: "Paul Seck", phone: "76 345 6789", role: "Ancien", joinDate: "2023-06-10" },
                { id: "m4", name: "Ruth Gueye", phone: "70 456 7890", role: "Membre", joinDate: "2024-07-01" },
              ],
            },
            {
              id: "e2", name: "Église de Maison Médina", leader: "Frère Sarr",
              members: [
                { id: "m5", name: "Pierre Thiam", phone: "77 567 8901", role: "Membre", joinDate: "2024-02-10" },
                { id: "m6", name: "Esther Fall", phone: "78 678 9012", role: "Membre", joinDate: "2024-05-15" },
              ],
            },
          ],
        },
        {
          id: "l2", name: "Localité Parcelles Assainies", leader: "Frère Tall",
          eglises: [
            {
              id: "e3", name: "Église de Maison Parcelles U14", leader: "Sœur Cissé",
              members: [
                { id: "m7", name: "Daniel Ndoye", phone: "77 789 0123", role: "Membre", joinDate: "2024-04-01" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "r2", name: "Région Thiès", leader: "Frère Diagne",
      localites: [
        {
          id: "l3", name: "Localité Thiès Centre", leader: "Frère Ba",
          eglises: [
            {
              id: "e4", name: "Église de Maison Thiès Nord", leader: "Frère Mboup",
              members: [
                { id: "m8", name: "Samuel Diouf", phone: "77 890 1234", role: "Membre", joinDate: "2024-01-20" },
                { id: "m9", name: "Lydia Sow", phone: "78 901 2345", role: "Membre", joinDate: "2024-08-05" },
              ],
            },
          ],
        },
      ],
    },
  ],
  reports: [
    { id: "rp1", egliseId: "e1", date: "2026-03-13", day: "Jeudi", summary: "Étude du Message de Bertoua - Leçon 5. Temps de prière puissant.", presents: ["m1", "m2", "m3"], absents: ["m4"], tithePayers: ["m1", "m3"], ministries: "2 témoignages, 1 prophétie, prière d'intercession", offering: 15000 },
    { id: "rp2", egliseId: "e1", date: "2026-03-16", day: "Dimanche", summary: "Culte d'adoration. Prédication sur la foi. Communion fraternelle.", presents: ["m1", "m3", "m4"], absents: ["m2"], tithePayers: ["m1", "m4"], ministries: "3 témoignages, louange, prière pour les malades", offering: 20000 },
    { id: "rp3", egliseId: "e1", date: "2026-03-09", day: "Dimanche", summary: "Message sur la sanctification. Temps de communion.", presents: ["m1", "m2", "m3", "m4"], absents: [], tithePayers: ["m1", "m2", "m3"], ministries: "2 témoignages, louange", offering: 18000 },
    { id: "rp4", egliseId: "e1", date: "2026-03-06", day: "Jeudi", summary: "Message de Bertoua - Leçon 4. Exercices pratiques.", presents: ["m2", "m3", "m4"], absents: ["m1"], tithePayers: ["m2", "m3", "m4"], ministries: "1 témoignage, intercession", offering: 12000 },
    { id: "rp5", egliseId: "e2", date: "2026-03-13", day: "Jeudi", summary: "Message de Bertoua - Leçon 4. Discussion enrichissante.", presents: ["m5"], absents: ["m6"], tithePayers: ["m5"], ministries: "1 témoignage, prière", offering: 8000 },
    { id: "rp6", egliseId: "e4", date: "2026-03-16", day: "Dimanche", summary: "Culte dominical. Prédication sur l'amour fraternel.", presents: ["m8", "m9"], absents: [], tithePayers: ["m8"], ministries: "louange, 2 témoignages", offering: 10000 },
  ],
  lessons: [
    { id: "ls1", number: 1, title: "La Nouvelle Naissance", description: "Fondement de la vie chrétienne" },
    { id: "ls2", number: 2, title: "L'Assurance du Salut", description: "Certitude de notre salut en Christ" },
    { id: "ls3", number: 3, title: "Le Baptême d'Eau", description: "Signification et importance du baptême" },
    { id: "ls4", number: 4, title: "Le Saint-Esprit", description: "La personne et l'œuvre du Saint-Esprit" },
    { id: "ls5", number: 5, title: "La Prière", description: "Communion avec Dieu par la prière" },
    { id: "ls6", number: 6, title: "La Parole de Dieu", description: "Étude et méditation des Écritures" },
    { id: "ls7", number: 7, title: "L'Église", description: "Le corps de Christ et la vie communautaire" },
    { id: "ls8", number: 8, title: "Le Service", description: "Servir Dieu et les frères" },
  ],
  grades: [
    { memberId: "m1", lessonId: "ls1", score: 18, date: "2025-09-10" },
    { memberId: "m1", lessonId: "ls2", score: 16, date: "2025-10-08" },
    { memberId: "m1", lessonId: "ls3", score: 19, date: "2025-11-12" },
    { memberId: "m1", lessonId: "ls4", score: 17, date: "2025-12-10" },
    { memberId: "m1", lessonId: "ls5", score: 15, date: "2026-01-14" },
    { memberId: "m2", lessonId: "ls1", score: 14, date: "2025-09-10" },
    { memberId: "m2", lessonId: "ls2", score: 17, date: "2025-10-08" },
    { memberId: "m2", lessonId: "ls3", score: 13, date: "2025-11-12" },
    { memberId: "m3", lessonId: "ls1", score: 20, date: "2025-09-10" },
    { memberId: "m3", lessonId: "ls2", score: 19, date: "2025-10-08" },
    { memberId: "m3", lessonId: "ls3", score: 18, date: "2025-11-12" },
    { memberId: "m3", lessonId: "ls4", score: 20, date: "2025-12-10" },
    { memberId: "m3", lessonId: "ls5", score: 19, date: "2026-01-14" },
    { memberId: "m3", lessonId: "ls6", score: 17, date: "2026-02-11" },
    { memberId: "m5", lessonId: "ls1", score: 12, date: "2025-09-10" },
    { memberId: "m5", lessonId: "ls2", score: 15, date: "2025-10-08" },
    { memberId: "m8", lessonId: "ls1", score: 16, date: "2025-09-10" },
    { memberId: "m8", lessonId: "ls2", score: 14, date: "2025-10-08" },
    { memberId: "m8", lessonId: "ls3", score: 18, date: "2025-11-12" },
    { memberId: "m8", lessonId: "ls4", score: 15, date: "2025-12-10" },
  ],
};

const I = {
  dash: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  region: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  localite: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/></svg>,
  church: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21V7l-6-4-6 4v14"/><path d="M3 21h18"/><path d="M9 21v-4h6v4"/><path d="M12 3v4"/></svg>,
  members: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  report: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  lesson: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  progress: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  tithe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chev: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n);
const getAllEglises = (d) => { const l=[]; d.regions.forEach(r=>r.localites.forEach(lo=>lo.eglises.forEach(e=>l.push({...e,regionName:r.name,localiteName:lo.name,regionId:r.id,localiteId:lo.id})))); return l; };
const getAllMembers = (d) => { const l=[]; getAllEglises(d).forEach(e=>e.members.forEach(m=>l.push({...m,egliseName:e.name,egliseId:e.id}))); return l; };
const findEglise = (d, eid) => { for(const r of d.regions) for(const l of r.localites) for(const e of l.eglises) if(e.id===eid) return {eglise:e,localite:l,region:r}; return {}; };
const getTitheStats = (d, mid, eid) => { const reps=d.reports.filter(r=>r.egliseId===eid); if(!reps.length) return {total:0,paid:0,pct:0}; const pr=reps.filter(r=>r.presents?.includes(mid)); const pd=pr.filter(r=>r.tithePayers?.includes(mid)); return {total:pr.length,paid:pd.length,pct:pr.length>0?Math.round((pd.length/pr.length)*100):0}; };

const inpS = { width:"100%", padding:"10px 14px", border:"2px solid #d4e4f4", borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color .2s", background:"#fff" };
const lblS = { display:"block", marginBottom:6, fontSize:13, fontWeight:600, color:"#2a4a6a", fontFamily:"'DM Sans',sans-serif" };
const btnP = { padding:"10px 24px", background:"#1a6cb5", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:"inline-flex", alignItems:"center", gap:8 };
const btnS = { ...btnP, background:"#edf4fb", color:"#2a4a6a" };
const btnD = { ...btnP, background:"#c0392b", fontSize:13, padding:"8px 16px" };

function Modal({open,onClose,title,children}) {
  if(!open) return null;
  return (<div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn .2s"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:540,maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:"1px solid #d4e4f4",position:"sticky",top:0,background:"#fff",borderRadius:"16px 16px 0 0",zIndex:2}}>
        <h3 style={{margin:0,fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#6889a8",padding:4}}>{I.close}</button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>);
}

function Badge({color,bg,children}) { return <span style={{padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:bg,color,whiteSpace:"nowrap"}}>{children}</span>; }

function TitheBar({pct}) {
  const c = pct>=75?"#2d6a2d":pct>=50?"#856d12":"#922b21";
  return (<div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{flex:1,height:6,background:"#e0ecf6",borderRadius:3,minWidth:50}}><div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:3,transition:"width .3s"}}/></div>
    <span style={{fontSize:12,fontWeight:700,color:c,minWidth:36,textAlign:"right"}}>{pct}%</span>
  </div>);
}

function ConfirmBtn({onConfirm,style:st}) {
  const [c,setC]=useState(false);
  if(c) return (<div style={{display:"flex",gap:6,alignItems:"center"}}>
    <button onClick={()=>{onConfirm();setC(false);}} style={{...btnD,padding:"6px 12px",fontSize:12}}>Confirmer</button>
    <button onClick={()=>setC(false)} style={{...btnS,padding:"6px 12px",fontSize:12}}>Annuler</button>
  </div>);
  return <button onClick={()=>setC(true)} style={st||{background:"none",border:"none",cursor:"pointer",color:"#c0392b",padding:4}} title="Supprimer">{I.trash}</button>;
}

export default function CMCIApp() {
  const [data,setData]=useState(defaultData);
  const [view,setView]=useState("dashboard");
  const [sel,setSel]=useState({});
  const [modal,setModal]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  const nav=useCallback((v,o={})=>{setView(v);setSel(o);setSidebarOpen(false);},[]);
  const upd=useCallback(fn=>{setData(p=>{const n=JSON.parse(JSON.stringify(p));fn(n);return n;});},[]);

  const allE=useMemo(()=>getAllEglises(data),[data]);
  const allM=useMemo(()=>getAllMembers(data),[data]);

  const gTR=useMemo(()=>{if(!allM.length)return 0;let s=0;allM.forEach(m=>{s+=getTitheStats(data,m.id,m.egliseId).pct;});return Math.round(s/allM.length);},[data,allM]);

  const navItems=[
    {id:"dashboard",label:"Tableau de Bord",icon:I.dash},
    {id:"regions",label:"Régions",icon:I.region},
    {id:"localites",label:"Localités",icon:I.localite},
    {id:"eglises",label:"Églises de Maison",icon:I.church},
    {id:"tithe",label:"Suivi des Dîmes",icon:I.tithe},
    {id:"reports",label:"Rapports",icon:I.report},
    {id:"lessons",label:"Leçons Bertoua",icon:I.lesson},
    {id:"progress",label:"Progression",icon:I.progress},
  ];

  // ── Dashboard ──
  function PgDash(){
    const stats=[
      {label:"Régions",value:data.regions.length,color:"#1a6cb5"},
      {label:"Localités",value:data.regions.reduce((s,r)=>s+r.localites.length,0),color:"#3b9bd9"},
      {label:"Églises de Maison",value:allE.length,color:"#6b8f71"},
      {label:"Membres",value:allM.length,color:"#5b7fa5"},
      {label:"Régularité Dîmes",value:`${gTR}%`,color:"#2a7bc0"},
      {label:"Offrandes (FCFA)",value:fmt(data.reports.reduce((s,r)=>s+(r.offering||0),0)),color:"#7a8b6f"},
    ];
    return(<div>
      <div style={{marginBottom:32}}><h1 style={{fontSize:28,margin:0,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Bienvenue, CMCI Sénégal</h1><p style={{color:"#6889a8",margin:"8px 0 0",fontSize:15}}>Vue d'ensemble de l'organisation</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:32}}>
        {stats.map(s=>(<div key={s.label} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:s.color,borderRadius:"14px 0 0 14px"}}/>
          <div style={{fontSize:13,color:"#6889a8",marginBottom:8,fontWeight:500}}>{s.label}</div>
          <div style={{fontSize:26,fontWeight:700,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{s.value}</div>
        </div>))}
      </div>
      <h3 style={{fontSize:18,color:"#0a2a4a",marginBottom:16,fontFamily:"'Playfair Display',serif"}}>Derniers Rapports</h3>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {data.reports.sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(rp=>{const info=findEglise(data,rp.egliseId);return(
          <div key={rp.id} style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid #d4e4f4",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div><div style={{fontWeight:600,color:"#0a2a4a",fontSize:14}}>{info.eglise?.name||"—"}</div><div style={{fontSize:13,color:"#6889a8",marginTop:4}}>{rp.day} — {rp.date}</div></div>
            <div style={{display:"flex",gap:16,fontSize:13}}>
              <span style={{color:"#6b8f71"}}>✓ {rp.presents?.length||0}</span>
              <span style={{color:"#c0392b"}}>✗ {rp.absents?.length||0}</span>
              <span style={{color:"#2a7bc0"}}>♥ {rp.tithePayers?.length||0} dîmes</span>
            </div>
          </div>);})}
      </div>
    </div>);
  }

  // ── Regions ──
  function PgRegions(){
    if(sel.localite) return <PgLocalite/>;
    if(sel.region) return <PgRegionDet/>;
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Régions</h2>
        <button style={btnP} onClick={()=>setModal("addRegion")}>{I.plus} Nouvelle Région</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {data.regions.map(r=>(<div key={r.id} onClick={()=>nav("regions",{region:r.id})} style={{background:"#fff",borderRadius:14,padding:20,cursor:"pointer",border:"1px solid #d4e4f4",transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div><h3 style={{margin:0,fontSize:17,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{r.name}</h3><p style={{margin:"6px 0 0",fontSize:13,color:"#6889a8"}}>Dirigeant: {r.leader}</p></div>
            <span style={{color:"#3b9bd9"}}>{I.chev}</span>
          </div>
          <div style={{display:"flex",gap:16,marginTop:16,fontSize:13,color:"#2a4a6a"}}><span>{r.localites.length} localité(s)</span><span>{r.localites.reduce((s,l)=>s+l.eglises.length,0)} église(s)</span></div>
        </div>))}
      </div>
      <MdAddRegion/>
    </div>);
  }

  function PgRegionDet(){
    const region=data.regions.find(r=>r.id===sel.region); if(!region) return null;
    return(<div>
      <button onClick={()=>nav("regions")} style={{...btnS,marginBottom:20,padding:"8px 16px"}}>{I.back} Retour</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div><h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{region.name}</h2><p style={{margin:"6px 0 0",fontSize:14,color:"#6889a8"}}>Dirigeant: {region.leader}</p></div>
        <button style={btnP} onClick={()=>setModal("addLocalite")}>{I.plus} Nouvelle Localité</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {region.localites.map(l=>(<div key={l.id} onClick={()=>nav("regions",{region:sel.region,localite:l.id})} style={{background:"#fff",borderRadius:14,padding:20,cursor:"pointer",border:"1px solid #d4e4f4",transition:"transform .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
          <h3 style={{margin:0,fontSize:16,color:"#0a2a4a"}}>{l.name}</h3><p style={{margin:"6px 0 0",fontSize:13,color:"#6889a8"}}>Dirigeant: {l.leader}</p><p style={{margin:"8px 0 0",fontSize:13,color:"#2a4a6a"}}>{l.eglises.length} église(s)</p>
        </div>))}
      </div>
      <MdAddLocalite region={region}/>
    </div>);
  }

  function PgLocalite(){
    const region=data.regions.find(r=>r.id===sel.region); const loc=region?.localites.find(l=>l.id===sel.localite); if(!loc) return null;
    return(<div>
      <button onClick={()=>nav("regions",{region:sel.region})} style={{...btnS,marginBottom:20,padding:"8px 16px"}}>{I.back} Retour à {region.name}</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div><h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{loc.name}</h2><p style={{margin:"6px 0 0",fontSize:14,color:"#6889a8"}}>Dirigeant: {loc.leader} — {region.name}</p></div>
        <button style={btnP} onClick={()=>setModal("addEglise")}>{I.plus} Nouvelle Église</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {loc.eglises.map(e=>(<div key={e.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",transition:"transform .15s"}} onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={ev=>{ev.currentTarget.style.transform="";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{cursor:"pointer",flex:1}} onClick={()=>nav("eglise-detail",{region:sel.region,localite:sel.localite,eglise:e.id})}>
              <h3 style={{margin:0,fontSize:15,color:"#0a2a4a"}}>{e.name}</h3><p style={{margin:"6px 0 0",fontSize:13,color:"#6889a8"}}>Dirigeant: {e.leader}</p><p style={{margin:"8px 0 0",fontSize:13,color:"#6b8f71"}}>{e.members.length} membre(s)</p>
            </div>
            <ConfirmBtn onConfirm={()=>upd(d=>{const lo2=d.regions.find(r=>r.id===sel.region)?.localites.find(l=>l.id===sel.localite);if(lo2)lo2.eglises=lo2.eglises.filter(x=>x.id!==e.id);d.reports=d.reports.filter(r=>r.egliseId!==e.id);})}/>
          </div>
        </div>))}
      </div>
      <MdAddEglise localite={loc}/>
    </div>);
  }

  // ── Eglise Detail ──
  function PgEgliseDet(){
    const info=findEglise(data,sel.eglise); if(!info.eglise) return null;
    const {eglise,localite,region}=info;
    const reps=data.reports.filter(r=>r.egliseId===eglise.id).sort((a,b)=>b.date.localeCompare(a.date));
    return(<div>
      <button onClick={()=>{if(sel.localite) nav("regions",{region:region.id,localite:localite.id}); else nav("eglises");}} style={{...btnS,marginBottom:20,padding:"8px 16px"}}>{I.back} Retour</button>
      <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #d4e4f4",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:22,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{eglise.name}</h2>
        <p style={{margin:"8px 0 0",fontSize:14,color:"#6889a8"}}>{region.name} → {localite.name} — Dirigeant: {eglise.leader}</p>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <h3 style={{margin:0,fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Membres ({eglise.members.length})</h3>
        <button style={btnP} onClick={()=>setModal("addMember")}>{I.plus} Ajouter</button>
      </div>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #d4e4f4",overflow:"hidden",marginBottom:32}}>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
          <thead><tr style={{background:"#f0f5fb"}}>{["Nom","Téléphone","Rôle","Dîme","Actions"].map(h=>(<th key={h} style={{padding:"12px 16px",textAlign:"left",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase",letterSpacing:.5}}>{h}</th>))}</tr></thead>
          <tbody>{eglise.members.map(m=>{const ts=getTitheStats(data,m.id,eglise.id);return(
            <tr key={m.id} style={{borderTop:"1px solid #e0ecf6"}}>
              <td style={{padding:"12px 16px",fontWeight:500,color:"#0a2a4a"}}>{m.name}</td>
              <td style={{padding:"12px 16px",color:"#6889a8"}}>{m.phone}</td>
              <td style={{padding:"12px 16px"}}><Badge bg={m.role==="Ancien"?"#e8f0e8":"#edf4fb"} color={m.role==="Ancien"?"#3a6b3a":"#1a6cb5"}>{m.role}</Badge></td>
              <td style={{padding:"12px 16px",minWidth:120}}><TitheBar pct={ts.pct}/><div style={{fontSize:11,color:"#6889a8",marginTop:2}}>{ts.paid}/{ts.total} réunion(s)</div></td>
              <td style={{padding:"12px 16px"}}><div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>nav("member-detail",{eglise:eglise.id,member:m.id})} style={{background:"none",border:"none",cursor:"pointer",color:"#5b7fa5",padding:4}} title="Progression">{I.progress}</button>
                <ConfirmBtn onConfirm={()=>upd(d=>{const e2=findEglise(d,eglise.id).eglise;e2.members=e2.members.filter(x=>x.id!==m.id);d.reports.forEach(r=>{r.presents=r.presents?.filter(x=>x!==m.id);r.absents=r.absents?.filter(x=>x!==m.id);r.tithePayers=r.tithePayers?.filter(x=>x!==m.id);});d.grades=d.grades.filter(g=>g.memberId!==m.id);})}/>
              </div></td>
            </tr>);})}</tbody>
        </table></div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <h3 style={{margin:0,fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Rapports ({reps.length})</h3>
        <button style={btnP} onClick={()=>setModal("addReport")}>{I.plus} Nouveau Rapport</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {reps.length===0&&<p style={{color:"#6889a8",fontStyle:"italic"}}>Aucun rapport.</p>}
        {reps.map(rp=>(<div key={rp.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Badge bg={rp.day==="Dimanche"?"#e3ecf5":"#edf4fb"} color={rp.day==="Dimanche"?"#3a5a7a":"#1a6cb5"}>{rp.day}</Badge>
              <span style={{fontSize:14,color:"#2a4a6a"}}>{rp.date}</span>
            </div>
            <ConfirmBtn onConfirm={()=>upd(d=>{d.reports=d.reports.filter(x=>x.id!==rp.id);})}/>
          </div>
          <p style={{margin:"12px 0 0",fontSize:14,color:"#0a2a4a",lineHeight:1.5}}>{rp.summary}</p>
          <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap",fontSize:13}}>
            <span style={{color:"#6b8f71"}}>✓ {rp.presents?.length||0} présent(s)</span>
            <span style={{color:"#c0392b"}}>✗ {rp.absents?.length||0} absent(s)</span>
            <span style={{color:"#2a7bc0"}}>♥ {rp.tithePayers?.length||0} dîmeur(s)</span>
            <span style={{color:"#7a8b6f"}}>Offrande: {fmt(rp.offering||0)} FCFA</span>
          </div>
          {rp.tithePayers?.length>0&&<div style={{marginTop:8,fontSize:12,color:"#6889a8"}}><strong>Ont payé la dîme:</strong> {rp.tithePayers.map(pid=>eglise.members.find(m=>m.id===pid)?.name||"—").join(", ")}</div>}
          <div style={{marginTop:6,fontSize:13,color:"#6889a8"}}><strong>Ministères:</strong> {rp.ministries}</div>
        </div>))}
      </div>
      <MdAddMember eglise={eglise}/>
      <MdAddReport eglise={eglise}/>
    </div>);
  }

  // ── All Localites ──
  function PgAllLocalites(){
    const allLocs=[];
    data.regions.forEach(r=>r.localites.forEach(l=>allLocs.push({...l,regionName:r.name,regionId:r.id,egliseCount:l.eglises.length,memberCount:l.eglises.reduce((s,e)=>s+e.members.length,0)})));

    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Toutes les Localités ({allLocs.length})</h2>
        <button style={btnP} onClick={()=>setModal("addLocaliteGlobal")}>{I.plus} Nouvelle Localité</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {allLocs.map(l=>(<div key={l.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",transition:"transform .15s"}} onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={ev=>{ev.currentTarget.style.transform="";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{cursor:"pointer",flex:1}} onClick={()=>nav("regions",{region:l.regionId,localite:l.id})}>
              <h3 style={{margin:0,fontSize:16,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{l.name}</h3>
              <p style={{margin:"4px 0 0",fontSize:12,color:"#3b9bd9"}}>{l.regionName}</p>
              <p style={{margin:"6px 0 0",fontSize:13,color:"#6889a8"}}>Dirigeant: {l.leader}</p>
              <div style={{display:"flex",gap:16,marginTop:10,fontSize:13,color:"#2a4a6a"}}>
                <span>{l.egliseCount} église(s)</span>
                <span>{l.memberCount} membre(s)</span>
              </div>
            </div>
            <ConfirmBtn onConfirm={()=>upd(d=>{
              for(const r of d.regions){
                const loc=r.localites.find(x=>x.id===l.id);
                if(loc){
                  loc.eglises.forEach(e=>{d.reports=d.reports.filter(rp=>rp.egliseId!==e.id);});
                  r.localites=r.localites.filter(x=>x.id!==l.id);
                }
              }
            })}/>
          </div>
        </div>))}
      </div>
      <MdAddLocaliteGlobal/>
    </div>);
  }

  function MdAddLocaliteGlobal(){
    const [rId,sRId]=useState("");
    const [n,sN]=useState("");
    const [l,sL]=useState("");
    return(<Modal open={modal==="addLocaliteGlobal"} onClose={()=>{setModal(null);sRId("");}} title="Nouvelle Localité">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <label style={lblS}>Région</label>
          <select style={inpS} value={rId} onChange={e=>sRId(e.target.value)}>
            <option value="">— Choisir une région —</option>
            {data.regions.map(r=>(<option key={r.id} value={r.id}>{r.name}</option>))}
          </select>
        </div>
        {rId&&<>
          <div><label style={lblS}>Nom de la Localité</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Ex: Localité Guédiawaye"/></div>
          <div><label style={lblS}>Dirigeant</label><input style={inpS} value={l} onChange={e=>sL(e.target.value)} placeholder="Nom du dirigeant"/></div>
          <button style={btnP} onClick={()=>{
            if(!n.trim()||!rId) return;
            upd(d=>{d.regions.find(r=>r.id===rId).localites.push({id:uid(),name:n,leader:l,eglises:[]});});
            setModal(null);sRId("");
          }}>{I.check} Créer la Localité</button>
        </>}
      </div>
    </Modal>);
  }

  // ── All Eglises ──
  function PgAllEglises(){
    if(sel.eglise) return <PgEgliseDet/>;
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Toutes les Églises de Maison</h2>
        <button style={btnP} onClick={()=>setModal("addEgliseGlobal")}>{I.plus} Nouvelle Église</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {allE.map(e=>(<div key={e.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",transition:"transform .15s"}} onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={ev=>{ev.currentTarget.style.transform="";}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{cursor:"pointer",flex:1}} onClick={()=>nav("eglises",{eglise:e.id})}>
              <h3 style={{margin:0,fontSize:15,color:"#0a2a4a"}}>{e.name}</h3>
              <p style={{margin:"4px 0 0",fontSize:12,color:"#3b9bd9"}}>{e.regionName} → {e.localiteName}</p>
              <p style={{margin:"6px 0 0",fontSize:13,color:"#6889a8"}}>Dirigeant: {e.leader}</p>
              <p style={{margin:"8px 0 0",fontSize:13,color:"#6b8f71",fontWeight:600}}>{e.members.length} membre(s)</p>
            </div>
            <ConfirmBtn onConfirm={()=>upd(d=>{for(const r of d.regions)for(const l of r.localites)l.eglises=l.eglises.filter(x=>x.id!==e.id);d.reports=d.reports.filter(r=>r.egliseId!==e.id);})}/>
          </div>
        </div>))}
      </div>
      <MdAddEgliseGlobal/>
    </div>);
  }

  // ── Tithe ──
  function PgTithe(){
    if(sel.eglise) return <PgTitheEgl/>;
    return(<div>
      <h2 style={{margin:"0 0 8px",fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Suivi des Dîmes</h2>
      <p style={{color:"#6889a8",margin:"0 0 24px",fontSize:14}}>Régularité du paiement de la dîme par église de maison</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {allE.map(e=>{const reps=data.reports.filter(r=>r.egliseId===e.id);return(
          <div key={e.id} onClick={()=>nav("tithe",{eglise:e.id})} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",cursor:"pointer",transition:"transform .15s"}} onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={ev=>{ev.currentTarget.style.transform="";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
              <div><h3 style={{margin:0,fontSize:15,color:"#0a2a4a"}}>{e.name}</h3><p style={{margin:"4px 0 0",fontSize:12,color:"#3b9bd9"}}>{e.regionName} → {e.localiteName}</p></div>
              <span style={{color:"#3b9bd9"}}>{I.chev}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {e.members.map(m=>{const ts=getTitheStats(data,m.id,e.id);return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:10,fontSize:13}}>
                <span style={{width:100,color:"#2a4a6a",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
                <div style={{flex:1}}><TitheBar pct={ts.pct}/></div>
              </div>);})}
              {e.members.length===0&&<p style={{fontSize:12,color:"#3b9bd9",fontStyle:"italic"}}>Aucun membre</p>}
            </div>
            <div style={{marginTop:12,fontSize:12,color:"#6889a8"}}>{reps.length} rapport(s)</div>
          </div>);})}
      </div>
    </div>);
  }

  function PgTitheEgl(){
    const info=findEglise(data,sel.eglise); if(!info.eglise) return null;
    const {eglise,localite,region}=info;
    const reps=data.reports.filter(r=>r.egliseId===eglise.id).sort((a,b)=>b.date.localeCompare(a.date));
    return(<div>
      <button onClick={()=>nav("tithe")} style={{...btnS,marginBottom:20,padding:"8px 16px"}}>{I.back} Retour</button>
      <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #d4e4f4",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:22,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Dîmes — {eglise.name}</h2>
        <p style={{margin:"8px 0 0",fontSize:14,color:"#6889a8"}}>{region.name} → {localite.name}</p>
      </div>

      <h3 style={{margin:"0 0 16px",fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Régularité par Membre</h3>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #d4e4f4",overflow:"hidden",marginBottom:32}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead><tr style={{background:"#f0f5fb"}}>{["Membre","Présences","Dîmes payées","Régularité","Statut"].map(h=>(<th key={h} style={{padding:"12px 16px",textAlign:"left",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
        <tbody>{eglise.members.map(m=>{const ts=getTitheStats(data,m.id,eglise.id);const st=ts.pct>=80?"Fidèle":ts.pct>=50?"Irrégulier":"À encourager";const sc=ts.pct>=80?"#2d6a2d":ts.pct>=50?"#856d12":"#922b21";const sb=ts.pct>=80?"#e8f0e8":ts.pct>=50?"#fef9e7":"#fde8e8";return(
          <tr key={m.id} style={{borderTop:"1px solid #e0ecf6"}}>
            <td style={{padding:"12px 16px",fontWeight:500,color:"#0a2a4a"}}>{m.name}</td>
            <td style={{padding:"12px 16px",color:"#2a4a6a"}}>{ts.total}</td>
            <td style={{padding:"12px 16px",color:"#2a4a6a"}}>{ts.paid}</td>
            <td style={{padding:"12px 16px",minWidth:120}}><TitheBar pct={ts.pct}/></td>
            <td style={{padding:"12px 16px"}}><Badge bg={sb} color={sc}>{st}</Badge></td>
          </tr>);})}</tbody>
      </table></div></div>

      <h3 style={{margin:"0 0 16px",fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Détail par Réunion</h3>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13,background:"#fff",borderRadius:14,overflow:"hidden",border:"1px solid #d4e4f4"}}>
        <thead><tr style={{background:"#f0f5fb"}}>
          <th style={{padding:"12px 16px",textAlign:"left",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase"}}>Date</th>
          {eglise.members.map(m=>(<th key={m.id} style={{padding:"12px 8px",textAlign:"center",color:"#2a4a6a",fontWeight:600,fontSize:11,textTransform:"uppercase",minWidth:70}}>{m.name.split(" ")[0]}</th>))}
        </tr></thead>
        <tbody>{reps.map(rp=>(<tr key={rp.id} style={{borderTop:"1px solid #e0ecf6"}}>
          <td style={{padding:"10px 16px",color:"#2a4a6a",whiteSpace:"nowrap"}}><Badge bg={rp.day==="Dimanche"?"#e3ecf5":"#edf4fb"} color={rp.day==="Dimanche"?"#3a5a7a":"#1a6cb5"}>{rp.day}</Badge><span style={{marginLeft:8}}>{rp.date}</span></td>
          {eglise.members.map(m=>{const pr=rp.presents?.includes(m.id);const pd=rp.tithePayers?.includes(m.id);return(<td key={m.id} style={{padding:"8px",textAlign:"center"}}>
            {!pr?<span style={{color:"#b8d0e8"}}>—</span>:pd?<span style={{display:"inline-flex",width:28,height:28,borderRadius:"50%",background:"#e8f0e8",color:"#2d6a2d",alignItems:"center",justifyContent:"center"}}>{I.check}</span>:<span style={{display:"inline-flex",width:28,height:28,borderRadius:"50%",background:"#fde8e8",color:"#922b21",alignItems:"center",justifyContent:"center",fontSize:16}}>✗</span>}
          </td>);})}
        </tr>))}</tbody>
      </table></div>
    </div>);
  }

  // ── Reports ──
  function PgReports(){
    const [fDateFrom,sFDateFrom]=useState("");
    const [fDateTo,sFDateTo]=useState("");
    const [fRegion,sFRegion]=useState("");
    const [fLocalite,sFLocalite]=useState("");
    const [fEglise,sFEglise]=useState("");
    const [fDay,sFDay]=useState("");

    const filteredRegion=data.regions.find(r=>r.id===fRegion);
    const filteredLocs=filteredRegion?filteredRegion.localites:[];
    const filteredLoc=filteredLocs.find(l=>l.id===fLocalite);
    const filteredEgl=filteredLoc?filteredLoc.eglises:fRegion?filteredLocs.flatMap(l=>l.eglises):allE;

    const filtered=data.reports.filter(rp=>{
      if(fDateFrom&&rp.date<fDateFrom) return false;
      if(fDateTo&&rp.date>fDateTo) return false;
      if(fDay&&rp.day!==fDay) return false;
      if(fEglise&&rp.egliseId!==fEglise) return false;
      if(fLocalite&&!filteredLoc?.eglises.some(e=>e.id===rp.egliseId)) return false;
      if(fRegion&&!fLocalite&&!filteredRegion?.localites.some(l=>l.eglises.some(e=>e.id===rp.egliseId))) return false;
      return true;
    }).sort((a,b)=>b.date.localeCompare(a.date));

    const totalOff=filtered.reduce((s,r)=>s+(r.offering||0),0);
    const totalPres=filtered.reduce((s,r)=>s+(r.presents?.length||0),0);
    const totalAbs=filtered.reduce((s,r)=>s+(r.absents?.length||0),0);
    const totalTithe=filtered.reduce((s,r)=>s+(r.tithePayers?.length||0),0);
    const hasFilters=fDateFrom||fDateTo||fRegion||fLocalite||fEglise||fDay;

    const selS={...inpS,padding:"8px 12px",fontSize:13};

    return(<div>
      <h2 style={{margin:"0 0 20px",fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Rapports</h2>

      {/* Filters */}
      <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:14,fontWeight:600,color:"#2a4a6a"}}>Filtres</span>
          {hasFilters&&<button onClick={()=>{sFDateFrom("");sFDateTo("");sFRegion("");sFLocalite("");sFEglise("");sFDay("");}} style={{...btnS,padding:"5px 14px",fontSize:12}}>Réinitialiser</button>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          <div><label style={{...lblS,fontSize:11}}>Date début</label><input style={selS} type="date" value={fDateFrom} onChange={e=>sFDateFrom(e.target.value)}/></div>
          <div><label style={{...lblS,fontSize:11}}>Date fin</label><input style={selS} type="date" value={fDateTo} onChange={e=>sFDateTo(e.target.value)}/></div>
          <div><label style={{...lblS,fontSize:11}}>Jour</label>
            <select style={selS} value={fDay} onChange={e=>sFDay(e.target.value)}>
              <option value="">Tous</option><option value="Jeudi">Jeudi</option><option value="Dimanche">Dimanche</option>
            </select>
          </div>
          <div><label style={{...lblS,fontSize:11}}>Région</label>
            <select style={selS} value={fRegion} onChange={e=>{sFRegion(e.target.value);sFLocalite("");sFEglise("");}}>
              <option value="">Toutes</option>
              {data.regions.map(r=>(<option key={r.id} value={r.id}>{r.name}</option>))}
            </select>
          </div>
          {fRegion&&<div><label style={{...lblS,fontSize:11}}>Localité</label>
            <select style={selS} value={fLocalite} onChange={e=>{sFLocalite(e.target.value);sFEglise("");}}>
              <option value="">Toutes</option>
              {filteredLocs.map(l=>(<option key={l.id} value={l.id}>{l.name}</option>))}
            </select>
          </div>}
          <div><label style={{...lblS,fontSize:11}}>Église de Maison</label>
            <select style={selS} value={fEglise} onChange={e=>sFEglise(e.target.value)}>
              <option value="">Toutes</option>
              {filteredEgl.map(e=>(<option key={e.id} value={e.id}>{e.name}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        {[
          {label:"Rapports",value:filtered.length,color:"#1a6cb5"},
          {label:"Présents",value:totalPres,color:"#6b8f71"},
          {label:"Absents",value:totalAbs,color:"#c0392b"},
          {label:"Dîmeurs",value:totalTithe,color:"#2a7bc0"},
          {label:"Offrandes",value:fmt(totalOff)+" F",color:"#7a8b6f"},
        ].map(s=>(<div key={s.label} style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #d4e4f4",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:s.color}}/>
          <div style={{fontSize:11,color:"#6889a8",marginBottom:4,fontWeight:500}}>{s.label}</div>
          <div style={{fontSize:20,fontWeight:700,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{s.value}</div>
        </div>))}
      </div>

      {/* List */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.length===0&&<p style={{color:"#6889a8",fontStyle:"italic",textAlign:"center",padding:32}}>Aucun rapport ne correspond aux filtres sélectionnés.</p>}
        {filtered.map(rp=>{const info=findEglise(data,rp.egliseId);return(
          <div key={rp.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}><Badge bg={rp.day==="Dimanche"?"#e3ecf5":"#edf4fb"} color={rp.day==="Dimanche"?"#3a5a7a":"#1a6cb5"}>{rp.day}</Badge><span style={{fontSize:14,color:"#2a4a6a"}}>{rp.date}</span></div>
              <div style={{textAlign:"right"}}><span style={{fontSize:13,color:"#3b9bd9",fontWeight:500}}>{info.eglise?.name}</span>
                {info.region&&<div style={{fontSize:11,color:"#6889a8"}}>{info.region.name} → {info.localite?.name}</div>}
              </div>
            </div>
            <p style={{margin:"12px 0 0",fontSize:14,color:"#0a2a4a",lineHeight:1.5}}>{rp.summary}</p>
            <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap",fontSize:13}}>
              <span style={{color:"#6b8f71"}}>✓ {rp.presents?.length||0}</span><span style={{color:"#c0392b"}}>✗ {rp.absents?.length||0}</span>
              <span style={{color:"#2a7bc0"}}>♥ {rp.tithePayers?.length||0} dîmeur(s)</span><span style={{color:"#7a8b6f"}}>Offrande: {fmt(rp.offering||0)} FCFA</span>
            </div>
          </div>);})}
      </div>
    </div>);
  }

  // ── Lessons ──
  function PgLessons(){
    return(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h2 style={{margin:0,fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Leçons du Message de Bertoua</h2>
        <button style={btnP} onClick={()=>setModal("addLesson")}>{I.plus} Nouvelle Leçon</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {data.lessons.map(ls=>{const gl=data.grades.filter(g=>g.lessonId===ls.id);const avg=gl.length>0?(gl.reduce((s,g)=>s+g.score,0)/gl.length).toFixed(1):"—";return(
          <div key={ls.id} style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #d4e4f4",position:"relative"}}>
            <div style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"#edf4fb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#1a6cb5",fontFamily:"'Playfair Display',serif"}}>{ls.number}</div>
            <h3 style={{margin:0,fontSize:16,color:"#0a2a4a",fontFamily:"'Playfair Display',serif",paddingRight:44}}>{ls.title}</h3>
            <p style={{margin:"8px 0 0",fontSize:13,color:"#6889a8",lineHeight:1.4}}>{ls.description}</p>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:16,fontSize:13}}><span style={{color:"#2a4a6a"}}>{gl.length} évaluation(s)</span><span style={{fontWeight:600,color:"#6b8f71"}}>Moy: {avg}/20</span></div>
          </div>);})}
      </div>
      <MdAddLesson/>
    </div>);
  }

  // ── Progress ──
  function PgProgress(){
    if(sel.member) return <PgMemberProg/>;
    return(<div>
      <h2 style={{margin:"0 0 24px",fontSize:24,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Progression des Membres</h2>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #d4e4f4",overflow:"hidden"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead><tr style={{background:"#f0f5fb"}}>
          <th style={{padding:"12px 16px",textAlign:"left",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase"}}>Membre</th>
          <th style={{padding:"12px 16px",textAlign:"left",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase"}}>Église</th>
          {data.lessons.map(ls=>(<th key={ls.id} style={{padding:"12px 8px",textAlign:"center",color:"#2a4a6a",fontWeight:600,fontSize:11,textTransform:"uppercase",minWidth:50}}>L{ls.number}</th>))}
          <th style={{padding:"12px 16px",textAlign:"center",color:"#2a4a6a",fontWeight:600,fontSize:12,textTransform:"uppercase"}}>Moy</th>
        </tr></thead>
        <tbody>{allM.map(m=>{const mg=data.grades.filter(g=>g.memberId===m.id);const avg=mg.length>0?(mg.reduce((s,g)=>s+g.score,0)/mg.length).toFixed(1):"—";return(
          <tr key={m.id} style={{borderTop:"1px solid #e0ecf6",cursor:"pointer"}} onClick={()=>nav("progress",{member:m.id})} onMouseEnter={e=>e.currentTarget.style.background="#f5f8fc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"12px 16px",fontWeight:500,color:"#0a2a4a"}}>{m.name}</td>
            <td style={{padding:"12px 16px",fontSize:13,color:"#6889a8"}}>{m.egliseName}</td>
            {data.lessons.map(ls=>{const gr=data.grades.find(g=>g.memberId===m.id&&g.lessonId===ls.id);return(<td key={ls.id} style={{padding:"8px",textAlign:"center"}}>
              {gr?<span style={{display:"inline-block",width:32,height:32,lineHeight:"32px",borderRadius:8,fontSize:12,fontWeight:700,background:gr.score>=16?"#e8f0e8":gr.score>=12?"#fef9e7":"#fde8e8",color:gr.score>=16?"#2d6a2d":gr.score>=12?"#856d12":"#922b21"}}>{gr.score}</span>:<span style={{color:"#b8d0e8",fontSize:18}}>·</span>}
            </td>);})}
            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:700,color:"#0a2a4a"}}>{avg}</td>
          </tr>);})}</tbody>
      </table></div></div>
    </div>);
  }

  function PgMemberProg(){
    const member=allM.find(m=>m.id===sel.member); if(!member) return null;
    const mg=data.grades.filter(g=>g.memberId===member.id);
    const avg=mg.length>0?(mg.reduce((s,g)=>s+g.score,0)/mg.length).toFixed(1):"—";
    const ts=getTitheStats(data,member.id,member.egliseId);
    return(<div>
      <button onClick={()=>{if(sel.eglise) nav("eglise-detail",{eglise:sel.eglise}); else nav("progress");}} style={{...btnS,marginBottom:20,padding:"8px 16px"}}>{I.back} Retour</button>
      <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #d4e4f4",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:22,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>{member.name}</h2>
        <p style={{margin:"8px 0 0",fontSize:14,color:"#6889a8"}}>{member.egliseName} — {member.role}</p>
        <div style={{display:"flex",gap:16,marginTop:16,flexWrap:"wrap"}}>
          <div style={{padding:"12px 20px",background:"#edf4fb",borderRadius:12,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#1a6cb5",fontFamily:"'Playfair Display',serif"}}>{mg.length}/{data.lessons.length}</div><div style={{fontSize:12,color:"#6889a8",marginTop:4}}>Leçons</div></div>
          <div style={{padding:"12px 20px",background:"#e8f0e8",borderRadius:12,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:"#3a6b3a",fontFamily:"'Playfair Display',serif"}}>{avg}/20</div><div style={{fontSize:12,color:"#5a7a5a",marginTop:4}}>Moyenne</div></div>
          <div style={{padding:"12px 20px",background:ts.pct>=80?"#e8f0e8":ts.pct>=50?"#fef9e7":"#fde8e8",borderRadius:12,textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:ts.pct>=80?"#3a6b3a":ts.pct>=50?"#856d12":"#922b21",fontFamily:"'Playfair Display',serif"}}>{ts.pct}%</div><div style={{fontSize:12,color:"#6889a8",marginTop:4}}>Dîme ({ts.paid}/{ts.total})</div></div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <h3 style={{margin:0,fontSize:18,color:"#0a2a4a",fontFamily:"'Playfair Display',serif"}}>Notes par Leçon</h3>
        <button style={btnP} onClick={()=>setModal("addGrade")}>{I.plus} Ajouter Note</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {data.lessons.map(ls=>{const grade=data.grades.find(g=>g.memberId===member.id&&g.lessonId===ls.id);return(
          <div key={ls.id} style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid #d4e4f4",opacity:grade?1:.5}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#3b9bd9",fontWeight:700}}>Leçon {ls.number}</span>
              {grade&&<span style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,background:grade.score>=16?"#e8f0e8":grade.score>=12?"#fef9e7":"#fde8e8",color:grade.score>=16?"#2d6a2d":grade.score>=12?"#856d12":"#922b21"}}>{grade.score}</span>}
            </div>
            <h4 style={{margin:"8px 0 4px",fontSize:14,color:"#0a2a4a"}}>{ls.title}</h4>
            {grade?<span style={{fontSize:12,color:"#6889a8"}}>Évalué le {grade.date}</span>:<span style={{fontSize:12,color:"#3b9bd9",fontStyle:"italic"}}>Non évalué</span>}
          </div>);})}
      </div>
      <MdAddGrade member={member}/>
    </div>);
  }

  // ── Modals ──
  function MdAddRegion(){const [n,sN]=useState("");const [l,sL]=useState("");return(<Modal open={modal==="addRegion"} onClose={()=>setModal(null)} title="Nouvelle Région"><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Nom</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Ex: Région Saint-Louis"/></div><div><label style={lblS}>Dirigeant</label><input style={inpS} value={l} onChange={e=>sL(e.target.value)} placeholder="Nom du dirigeant"/></div><button style={btnP} onClick={()=>{if(!n.trim())return;upd(d=>d.regions.push({id:uid(),name:n,leader:l,localites:[]}));setModal(null);}}>{I.check} Créer</button></div></Modal>);}

  function MdAddLocalite({region}){const [n,sN]=useState("");const [l,sL]=useState("");return(<Modal open={modal==="addLocalite"} onClose={()=>setModal(null)} title="Nouvelle Localité"><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Nom</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Ex: Localité Guédiawaye"/></div><div><label style={lblS}>Dirigeant</label><input style={inpS} value={l} onChange={e=>sL(e.target.value)} placeholder="Nom du dirigeant"/></div><button style={btnP} onClick={()=>{if(!n.trim()||!region)return;upd(d=>{d.regions.find(x=>x.id===region.id).localites.push({id:uid(),name:n,leader:l,eglises:[]});});setModal(null);}}>{I.check} Créer</button></div></Modal>);}

  function MdAddEglise({localite}){const [n,sN]=useState("");const [l,sL]=useState("");return(<Modal open={modal==="addEglise"} onClose={()=>setModal(null)} title="Nouvelle Église de Maison"><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Nom</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Ex: Église de Maison Liberté 6"/></div><div><label style={lblS}>Dirigeant</label><input style={inpS} value={l} onChange={e=>sL(e.target.value)} placeholder="Nom du dirigeant"/></div><button style={btnP} onClick={()=>{if(!n.trim()||!localite)return;upd(d=>{for(const r of d.regions)for(const lo of r.localites)if(lo.id===localite.id)lo.eglises.push({id:uid(),name:n,leader:l,members:[]});});setModal(null);}}>{I.check} Créer</button></div></Modal>);}

  function MdAddEgliseGlobal(){
    const [rId,sRId]=useState("");
    const [lId,sLId]=useState("");
    const [n,sN]=useState("");
    const [l,sL]=useState("");
    const selRegion=data.regions.find(r=>r.id===rId);
    const locs=selRegion?selRegion.localites:[];
    return(<Modal open={modal==="addEgliseGlobal"} onClose={()=>{setModal(null);sRId("");sLId("");}} title="Nouvelle Église de Maison">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <label style={lblS}>Région</label>
          <select style={inpS} value={rId} onChange={e=>{sRId(e.target.value);sLId("");}}>
            <option value="">— Choisir une région —</option>
            {data.regions.map(r=>(<option key={r.id} value={r.id}>{r.name}</option>))}
          </select>
        </div>
        {rId&&<div>
          <label style={lblS}>Localité</label>
          <select style={inpS} value={lId} onChange={e=>sLId(e.target.value)}>
            <option value="">— Choisir une localité —</option>
            {locs.map(lo=>(<option key={lo.id} value={lo.id}>{lo.name}</option>))}
          </select>
          {locs.length===0&&<p style={{margin:"8px 0 0",fontSize:12,color:"#c0392b",fontStyle:"italic"}}>Aucune localité dans cette région. Créez-en une d'abord via Régions.</p>}
        </div>}
        {lId&&<>
          <div><label style={lblS}>Nom de l'Église</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Ex: Église de Maison Liberté 6"/></div>
          <div><label style={lblS}>Dirigeant</label><input style={inpS} value={l} onChange={e=>sL(e.target.value)} placeholder="Nom du dirigeant"/></div>
          <button style={btnP} onClick={()=>{
            if(!n.trim()||!lId) return;
            upd(d=>{for(const r of d.regions) for(const lo of r.localites) if(lo.id===lId) lo.eglises.push({id:uid(),name:n,leader:l,members:[]});});
            setModal(null);sRId("");sLId("");
          }}>{I.check} Créer l'Église</button>
        </>}
      </div>
    </Modal>);
  }

  function MdAddMember({eglise}){const [n,sN]=useState("");const [p,sP]=useState("");const [r,sR]=useState("Membre");return(<Modal open={modal==="addMember"} onClose={()=>setModal(null)} title="Ajouter un Membre"><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Nom complet</label><input style={inpS} value={n} onChange={e=>sN(e.target.value)} placeholder="Prénom et nom"/></div><div><label style={lblS}>Téléphone</label><input style={inpS} value={p} onChange={e=>sP(e.target.value)} placeholder="77 XXX XXXX"/></div><div><label style={lblS}>Rôle</label><select style={inpS} value={r} onChange={e=>sR(e.target.value)}><option value="Membre">Membre</option><option value="Ancien">Ancien</option><option value="Diacre">Diacre</option><option value="Dirigeant">Dirigeant</option></select></div><button style={btnP} onClick={()=>{if(!n.trim()||!eglise)return;upd(d=>{findEglise(d,eglise.id).eglise.members.push({id:uid(),name:n,phone:p,role:r,joinDate:new Date().toISOString().slice(0,10)});});setModal(null);}}>{I.check} Ajouter</button></div></Modal>);}

  function MdAddReport({eglise}){
    const [day,sDay]=useState("Jeudi");const [date,sDate]=useState(new Date().toISOString().slice(0,10));const [sum,sSum]=useState("");const [min,sMin]=useState("");const [off,sOff]=useState("");const [pres,sPres]=useState([]);const [tp,sTp]=useState([]);
    if(!eglise) return null;
    return(<Modal open={modal==="addReport"} onClose={()=>setModal(null)} title="Nouveau Rapport"><div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lblS}>Jour</label><select style={inpS} value={day} onChange={e=>sDay(e.target.value)}><option value="Jeudi">Jeudi</option><option value="Dimanche">Dimanche</option></select></div>
        <div><label style={lblS}>Date</label><input style={inpS} type="date" value={date} onChange={e=>sDate(e.target.value)}/></div>
      </div>
      <div><label style={lblS}>Résumé</label><textarea style={{...inpS,minHeight:80,resize:"vertical"}} value={sum} onChange={e=>sSum(e.target.value)} placeholder="Ce qui a été fait lors de cette rencontre..."/></div>
      <div><label style={lblS}>Présents</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {eglise.members.map(m=>(<label key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,background:pres.includes(m.id)?"#e8f0e8":"#edf4fb",color:pres.includes(m.id)?"#2d6a2d":"#2a4a6a",border:`1px solid ${pres.includes(m.id)?"#b5d4b5":"#d4e4f4"}`}}>
          <input type="checkbox" checked={pres.includes(m.id)} onChange={e=>{if(e.target.checked)sPres([...pres,m.id]);else{sPres(pres.filter(x=>x!==m.id));sTp(tp.filter(x=>x!==m.id));}}} style={{display:"none"}}/>{pres.includes(m.id)&&I.check} {m.name}
        </label>))}
      </div></div>
      {pres.length>0&&<div><label style={lblS}>Ont payé la dîme</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {eglise.members.filter(m=>pres.includes(m.id)).map(m=>(<label key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,background:tp.includes(m.id)?"#e3f0fd":"#edf4fb",color:tp.includes(m.id)?"#2a7bc0":"#2a4a6a",border:`1px solid ${tp.includes(m.id)?"#a8c8e8":"#d4e4f4"}`}}>
          <input type="checkbox" checked={tp.includes(m.id)} onChange={e=>{if(e.target.checked)sTp([...tp,m.id]);else sTp(tp.filter(x=>x!==m.id));}} style={{display:"none"}}/>{tp.includes(m.id)?"♥":"○"} {m.name}
        </label>))}
      </div></div>}
      <div><label style={lblS}>Ministères rendus</label><input style={inpS} value={min} onChange={e=>sMin(e.target.value)} placeholder="Ex: 2 témoignages, prière, louange"/></div>
      <div><label style={lblS}>Offrande (FCFA)</label><input style={inpS} type="number" value={off} onChange={e=>sOff(e.target.value)} placeholder="0"/></div>
      <button style={btnP} onClick={()=>{if(!sum.trim())return;const abs=eglise.members.map(m=>m.id).filter(id=>!pres.includes(id));upd(d=>{d.reports.push({id:uid(),egliseId:eglise.id,date,day,summary:sum,presents:pres,absents:abs,tithePayers:tp,ministries:min,offering:parseInt(off)||0});});setModal(null);}}>{I.check} Enregistrer</button>
    </div></Modal>);
  }

  function MdAddLesson(){const [t,sT]=useState("");const [d,sD]=useState("");return(<Modal open={modal==="addLesson"} onClose={()=>setModal(null)} title="Nouvelle Leçon"><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Titre</label><input style={inpS} value={t} onChange={e=>sT(e.target.value)} placeholder="Ex: Le Pardon"/></div><div><label style={lblS}>Description</label><textarea style={{...inpS,minHeight:60,resize:"vertical"}} value={d} onChange={e=>sD(e.target.value)} placeholder="Brève description"/></div><button style={btnP} onClick={()=>{if(!t.trim())return;upd(da=>{da.lessons.push({id:uid(),number:da.lessons.length+1,title:t,description:d});});setModal(null);}}>{I.check} Ajouter</button></div></Modal>);}

  function MdAddGrade({member}){const [li,sLi]=useState("");const [sc,sSc]=useState("");if(!member) return null;const ex=data.grades.filter(g=>g.memberId===member.id).map(g=>g.lessonId);const av=data.lessons.filter(ls=>!ex.includes(ls.id));return(<Modal open={modal==="addGrade"} onClose={()=>setModal(null)} title={`Note — ${member.name}`}><div style={{display:"flex",flexDirection:"column",gap:16}}><div><label style={lblS}>Leçon</label><select style={inpS} value={li} onChange={e=>sLi(e.target.value)}><option value="">— Choisir —</option>{av.map(ls=>(<option key={ls.id} value={ls.id}>Leçon {ls.number}: {ls.title}</option>))}</select></div><div><label style={lblS}>Note (/20)</label><input style={inpS} type="number" min="0" max="20" value={sc} onChange={e=>sSc(e.target.value)} placeholder="Ex: 16"/></div><button style={btnP} onClick={()=>{if(!li||!sc)return;upd(d=>{d.grades.push({memberId:member.id,lessonId:li,score:parseInt(sc),date:new Date().toISOString().slice(0,10)});});setModal(null);}}>{I.check} Enregistrer</button></div></Modal>);}

  const page=()=>{switch(view){case "dashboard":return <PgDash/>;case "regions":return <PgRegions/>;case "localites":return <PgAllLocalites/>;case "eglises":return <PgAllEglises/>;case "eglise-detail":return <PgEgliseDet/>;case "tithe":return <PgTithe/>;case "reports":return <PgReports/>;case "lessons":return <PgLessons/>;case "progress":return <PgProgress/>;case "member-detail":return <PgMemberProg/>;default:return <PgDash/>;}};

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#f0f5fb",minHeight:"100vh",display:"flex"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}*{box-sizing:border-box}
        input:focus,select:focus,textarea:focus{border-color:#1a6cb5!important}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#b8d0e8;border-radius:3px}
        @media(max-width:768px){.mob-btn{display:block!important}.sidebar{position:fixed!important;z-index:1050;transition:transform .25s ease}.main-c{margin-left:0!important}.overlay{display:block!important}}
      `}</style>

      <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="mob-btn" style={{position:"fixed",top:16,left:16,zIndex:1100,background:"#1a6cb5",color:"#fff",border:"none",borderRadius:10,padding:8,cursor:"pointer",display:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
        {sidebarOpen?I.close:I.menu}
      </button>

      <nav className="sidebar" style={{width:260,minHeight:"100vh",background:"#0a2a4a",padding:"24px 0",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,overflowY:"auto"}}>
        <style>{`@media(max-width:768px){.sidebar{transform:${sidebarOpen?"translateX(0)":"translateX(-100%)"}!important}}`}</style>
        <div style={{padding:"16px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={LOGO_SRC} alt="CMCI" style={{width:48,height:48,borderRadius:12,objectFit:"cover",background:"#fff"}}/>
            <div><div style={{color:"#fff",fontWeight:700,fontSize:16,fontFamily:"'Playfair Display',serif"}}>CMCI</div><div style={{color:"#3b9bd9",fontSize:11,fontWeight:600,letterSpacing:1.5}}>SÉNÉGAL</div></div>
          </div>
        </div>
        <div style={{padding:"16px 12px",flex:1}}>
          {navItems.map(item=>(<button key={item.id} onClick={()=>nav(item.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"10px 12px",marginBottom:2,border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",textAlign:"left",background:view===item.id||(item.id==="eglises"&&view==="eglise-detail")||(item.id==="tithe"&&sel.eglise&&view==="tithe")?"rgba(192,133,92,0.15)":"transparent",color:view===item.id||(item.id==="eglises"&&view==="eglise-detail")?"#3b9bd9":"rgba(255,255,255,0.6)",transition:"all .15s"}}
            onMouseEnter={e=>{if(view!==item.id){e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}}
            onMouseLeave={e=>{if(view!==item.id){e.currentTarget.style.color="rgba(255,255,255,0.6)";e.currentTarget.style.background="transparent";}}}>
            {item.icon}{item.label}
          </button>))}
        </div>
        <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:11,color:"rgba(255,255,255,0.3)"}}>CMCI Sénégal © 2026</div>
      </nav>

      {sidebarOpen&&<div className="overlay" onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1040,display:"none"}}/>}

      <main className="main-c" style={{marginLeft:260,flex:1,padding:"32px 32px 64px",minHeight:"100vh",maxWidth:"100%"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>{page()}</div>
      </main>
    </div>
  );
}