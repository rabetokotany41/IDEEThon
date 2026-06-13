import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, AlertTriangle, Activity, DollarSign,
  ShieldCheck, ArrowUpRight, CheckCircle, XCircle, Clock,
  Sprout, Truck, ShoppingCart, UserCheck, MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};
const card = (i: number) => ({
  initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.07 },
});
const ACCENT = '#a78bfa';

const Dashboard: React.FC = () => {
  const [logTab, setLogTab] = useState('tous');
  const [stats, setStats] = useState([
    { label: 'Utilisateurs actifs',   value: '0', unit: '',   icon: Users,         accent: ACCENT,    trend: '+0%' },
    { label: 'Volume transactions',   value: '0', unit: 'Ar', icon: DollarSign,    accent: '#4ade80', trend: '+0%' },
    { label: 'Commandes actives',  value: '0',     unit: '',   icon: Activity, accent: '#f87171', trend: 'Global' },
    { label: 'Santé système',         value: '99.9',  unit: '%',  icon: Activity,      accent: '#38bdf8', trend: 'Normal' },
  ]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/admin/stats');
        setStats([
          { label: 'Utilisateurs inscrits',   value: response.data.totalUsers.toString(), unit: '',   icon: Users,         accent: ACCENT,    trend: 'Global' },
          { label: 'Volume transactions',   value: response.data.totalRevenue.toLocaleString('fr-MG'), unit: 'Ar', icon: DollarSign,    accent: '#4ade80', trend: 'Global' },
          { label: 'Commandes actives',  value: response.data.activeOrders.toString(),     unit: '',   icon: Activity, accent: '#f87171', trend: 'En cours' },
          { label: 'Santé système',         value: '99.9',  unit: '%',  icon: Activity,      accent: '#38bdf8', trend: 'Normal' },
        ]);
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };
    fetchStats();
  }, []);

  const roles = [
    { label: 'Agriculteurs',  count: 892, pct: 61, color: '#4ade80', icon: <Sprout size={13} style={{ color: '#4ade80' }} /> },
    { label: 'Acheteurs',     count: 314, pct: 22, color: '#60a5fa', icon: <ShoppingCart size={13} style={{ color: '#60a5fa' }} /> },
    { label: 'Transporteurs', count: 168, pct: 12, color: '#fb923c', icon: <Truck size={13} style={{ color: '#fb923c' }} /> },
    { label: 'Agents',        count: 78,  pct: 5,  color: '#22d3ee', icon: <UserCheck size={13} style={{ color: '#22d3ee' }} /> },
  ];

  const barData = [30, 50, 40, 70, 55, 90, 75, 95, 80, 100, 85, 110];
  const months  = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const maxB    = Math.max(...barData);

  const reports = [
    { user: 'Hery Transports', issue: 'Fraude présumée — mission #082',       type: 'Fraude',   priority: 'high' },
    { user: 'Coop. AgroBeta',  issue: 'Qualité non conforme (Maïs)',          type: 'Qualité',  priority: 'medium' },
    { user: 'AcheteurPlus',    issue: 'Paiement non reçu — commande #1044',   type: 'Paiement', priority: 'high' },
    { user: 'Solo Randria',    issue: 'Compte bloqué sans raison apparente',  type: 'Compte',   priority: 'low' },
  ];

  const priorityConf: Record<string, { bg: string; color: string; label: string }> = {
    high:   { bg: 'rgba(248,113,113,0.15)', color: '#f87171', label: '● Haute' },
    medium: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', label: '● Moyenne' },
    low:    { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa', label: '● Basse' },
  };

  const allLogs = [
    { type: 'inscription', msg: 'Nouvel agent inscrit — Agent Rakotomavo',            time: '10 min', status: 'ok' },
    { type: 'système',     msg: 'Erreur sync météo API — retry 3/3',                  time: '1h',     status: 'error' },
    { type: 'opération',   msg: 'Validation coopérative Beta par Agent 02',           time: '3h',     status: 'ok' },
    { type: 'sécurité',    msg: 'Connexion suspecte — IP 41.x.x.x bloquée',           time: '4h',     status: 'alert' },
    { type: 'paiement',    msg: 'Transaction 850 000 Ar validée — Ref #TXN-4422',     time: '5h',     status: 'ok' },
    { type: 'système',     msg: 'Backup base de données effectué avec succès',         time: '6h',     status: 'ok' },
  ];

  const logCategories = ['tous', 'système', 'sécurité', 'opération', 'paiement'];
  const filteredLogs = logTab === 'tous' ? allLogs : allLogs.filter(l => l.type === logTab);

  const logConf: Record<string, { icon: React.ReactNode; color: string }> = {
    ok:    { icon: <CheckCircle  size={14} />, color: '#4ade80' },
    error: { icon: <XCircle      size={14} />, color: '#f87171' },
    alert: { icon: <AlertTriangle size={14} />, color: '#fbbf24' },
  };

  const quickActions = [
    { label: 'Suspendre un compte', icon: <XCircle size={20} />,    accent: '#f87171' },
    { label: 'Valider un agent',    icon: <UserCheck size={20} />,  accent: '#22d3ee' },
    { label: 'Export rapport PDF',  icon: <TrendingUp size={20} />, accent: '#4ade80' },
    { label: 'Config. système',     icon: <Activity size={20} />,   accent: ACCENT },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Jeudi, 5 Juin 2026</p>
          <h2 className="text-white font-bold text-2xl">Administration Globale 👑</h2>
          <p className="text-white/40 text-sm mt-1">Supervision complète de la plateforme AgriConnect Madagascar.</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle size={15} /> Signalements (7)
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm text-black"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', boxShadow: '0 8px 24px rgba(139,92,246,0.28)' }}>
            <ShieldCheck size={15} /> Gérer les accès
          </motion.button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
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

      {/* ── Row 2 : Graphe + Répartition ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Graphe annuel */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Performance</p>
              <h3 className="text-white font-bold text-lg">Volume des Transactions</h3>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl leading-none" style={{ color: '#4ade80' }}>{totalRevenue.toLocaleString('fr-MG')} Ar</p>
              <p className="text-xs mt-0.5" style={{ color: '#4ade8099' }}>Global</p>
            </div>
          </div>
          <div className="flex items-end gap-1.5 mt-6" style={{ height: 110 }}>
            {barData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative" style={{ height: 88 }}>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(v / maxB) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.55, ease: 'easeOut' }}
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{
                      background: i === 5
                        ? 'linear-gradient(to top,#7c3aed,#a78bfa)'
                        : 'linear-gradient(to top,rgba(139,92,246,0.45),rgba(167,139,250,0.15))'
                    }} />
                </div>
                <span className="text-[10px] text-white/25">{months[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Répartition rôles */}
        <motion.div {...card(5)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Utilisateurs</h3>
            <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition" style={{ color: ACCENT }}>
              Gérer <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="text-center mb-5">
            <p className="text-white font-bold text-4xl leading-none">1 452</p>
            <p className="text-white/35 text-xs mt-1">utilisateurs enregistrés</p>
          </div>

          {/* Barre multi-segments */}
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-5">
            {roles.map((r, i) => (
              <div key={i} className="rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
            ))}
          </div>

          <div className="space-y-2.5">
            {roles.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <div className="flex items-center gap-1.5">
                    {r.icon}
                    <span className="text-white/60 text-sm">{r.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{r.count}</span>
                  <span className="text-white/30 text-xs">{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Row 3 : Signalements + Logs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Signalements */}
        <motion.div {...card(6)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: '#f87171' }} /> Signalements ouverts
            </h3>
            <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-80" style={{ color: '#f87171' }}>
              Tous les cas <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {reports.map((r, i) => {
              const pc = priorityConf[r.priority];
              return (
                <div key={i} className="p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: r.priority === 'high' ? '1px solid rgba(248,113,113,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{r.issue}</p>
                      <p className="text-white/35 text-xs mt-0.5">{r.user} · {r.type}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: pc.bg, color: pc.color }}>{pc.label}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                      <MoreHorizontal size={12} /> Détails
                    </button>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                      style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <CheckCircle size={12} /> Résoudre
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Logs système */}
        <motion.div {...card(7)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Logs Système</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400">Live</span>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {logCategories.map(cat => (
              <button key={cat} onClick={() => setLogTab(cat)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={logTab === cat
                  ? { background: ACCENT, color: '#000' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredLogs.map((log, i) => {
              const lc = logConf[log.status];
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: lc.color, flexShrink: 0, marginTop: 1 }}>{lc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/75 text-xs leading-snug">{log.msg}</p>
                    <p className="text-white/30 text-[10px] capitalize mt-0.5">{log.type}</p>
                  </div>
                  <span className="text-white/25 text-[10px] flex-shrink-0 whitespace-nowrap">il y a {log.time}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Actions Rapides ── */}
      <motion.div {...card(8)} style={glass} className="p-6">
        <h3 className="text-white font-bold text-base mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <motion.button key={i} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: a.accent + '18', border: `1px solid ${a.accent}28` }}>
                <span style={{ color: a.accent }}>{a.icon}</span>
              </div>
              <span className="text-white/60 text-xs font-semibold text-center leading-snug">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
