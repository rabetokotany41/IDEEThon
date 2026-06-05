import React, { useState } from 'react';
import { Truck, MapPin, Package, Clock, CheckCircle, AlertTriangle, Navigation, Fuel, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};
const card = (i: number) => ({
  initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.07 },
});

const ACCENT = '#fb923c';

const Dashboard: React.FC = () => {
  const [mTab, setMTab] = useState<'actives' | 'terminees'>('actives');

  const stats = [
    { label: 'Missions ce mois',   value: '14',       unit: '',    icon: Truck,       accent: ACCENT,    trend: '+3 ce mois' },
    { label: 'Distance parcourue', value: '2 840',     unit: 'km',  icon: Navigation,  accent: '#fbbf24', trend: 'Ce mois' },
    { label: 'Revenus du mois',    value: '980 000',   unit: 'Ar',  icon: Package,     accent: '#facc15', trend: '+18%' },
    { label: 'Note transporteur',  value: '4.6',       unit: '/5',  icon: Star,        accent: '#a3e635', trend: 'Très bien' },
  ];

  const missionData = {
    actives: [
      { id: '#MSS-082', route: 'Antsirabe → Antananarivo', cargo: 'Riz (800 kg)',    client: 'Coop. Beta', distance: '170 km', status: 'En route',   eta: '14h30' },
      { id: '#MSS-083', route: 'Fianarantsoa → Antsirabe', cargo: 'Maïs (500 kg)',   client: 'AgroShop',   distance: '230 km', status: 'Chargement', eta: '16h00' },
    ],
    terminees: [
      { id: '#MSS-079', route: 'Toamasina → Tana',         cargo: 'Litchi (300 kg)',      client: 'FruiTrop',    distance: '360 km', status: 'Livré', eta: 'Hier 11h20' },
      { id: '#MSS-080', route: 'Mahajanga → Tana',          cargo: 'Poisson séché (200 kg)', client: 'Marché Centr.', distance: '580 km', status: 'Livré', eta: 'Avant-hier' },
      { id: '#MSS-081', route: 'Tuléar → Fianarantsoa',    cargo: 'Haricots (450 kg)',    client: 'Export SA',   distance: '310 km', status: 'Livré', eta: 'Il y a 3j' },
    ],
  };

  const alerts = [
    { msg: 'RN2 — Travaux entre km 84-92',              type: 'warning' },
    { msg: 'Pluies fortes — Hauts Plateaux',             type: 'info' },
    { msg: 'Contrôle gendarmerie — PK 120 RN1',          type: 'alert' },
  ];

  const alertConf: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
    warning: { bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)',  color: '#fb923c', icon: <AlertTriangle size={14} /> },
    info:    { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.2)',  color: '#38bdf8', icon: <MapPin size={14} /> },
    alert:   { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', color: '#f87171', icon: <AlertTriangle size={14} /> },
  };

  const missions = mTab === 'actives' ? missionData.actives : missionData.terminees;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Jeudi, 5 Juin 2026</p>
          <h2 className="text-white font-bold text-2xl">Bonjour, Solofo 🚛</h2>
          <p className="text-white/40 text-sm mt-1">2 missions actives aujourd'hui.</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.28)' }}>
          <MapPin size={16} /> Voir les Missions
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...card(i)} style={glass} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.accent + '1a', border: `1px solid ${s.accent}30` }}>
                  <Icon size={19} style={{ color: s.accent }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: s.accent + '18', color: s.accent }}>{s.trend}</span>
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium mb-1">{s.label}</p>
                <p className="text-white font-bold text-2xl leading-none">{s.value}
                  {s.unit && <span className="text-white/40 text-sm font-normal ml-1">{s.unit}</span>}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2 : Missions + Véhicule/Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Missions */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Mes Missions</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {([['actives','Actives'],['terminees','Terminées']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setMTab(k as 'actives' | 'terminees')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={mTab === k ? { background: ACCENT, color: '#000' } : { color: 'rgba(255,255,255,0.4)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {missions.map((m, i) => (
              <div key={i} className="p-4 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-white font-bold text-sm">{m.route}</p>
                    <p className="text-white/35 text-xs mt-0.5">{m.id} · {m.cargo} · {m.client}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                    style={m.status === 'Livré'
                      ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
                      : m.status === 'En route'
                      ? { background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }
                      : { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                    {m.status === 'Livré' ? <CheckCircle size={11} /> : <Clock size={11} />}
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs flex items-center gap-1"><Navigation size={10} /> {m.distance}</span>
                  <span className="text-white/30 text-xs flex items-center gap-1"><Clock size={10} /> {m.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Véhicule */}
          <motion.div {...card(5)} style={glass} className="p-5">
            <h3 className="text-white font-bold text-sm mb-4">État du Véhicule</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)' }}>
                <Truck size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Toyota HiAce</p>
                <p className="text-white/35 text-xs">MH-4821 · 2 Tonnes</p>
              </div>
            </div>
            {[
              { label: 'Carburant', pct: 68, color: '#4ade80', icon: <Fuel size={12} style={{ color: '#4ade80' }} /> },
              { label: 'Maintenance', pct: 85, color: '#fbbf24', icon: <Truck size={12} style={{ color: '#fbbf24' }} /> },
            ].map((v, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">{v.icon} {v.label}</div>
                  <span className="text-white font-bold text-xs">{v.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${v.pct}%`, background: v.color }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Alertes routes */}
          <motion.div {...card(6)} style={glass} className="p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <AlertTriangle size={15} style={{ color: ACCENT }} /> Alertes Routes
            </h3>
            <div className="space-y-2">
              {alerts.map((a, i) => {
                const ac = alertConf[a.type];
                return (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-xs font-medium"
                    style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.color }}>
                    {ac.icon}
                    <span>{a.msg}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
