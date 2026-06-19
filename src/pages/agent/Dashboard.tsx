import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, ClipboardList, TrendingUp, ArrowUpRight, CheckCircle, Clock, AlertTriangle, MapPin, Star, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};
const card = (i: number) => ({
  initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.07 },
});
const ACCENT = '#22d3ee';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'pending' | 'done'>('pending');
  const [stats, setStats] = useState([
    { label: 'Agriculteurs suivis',       value: '0',  unit: '',  icon: Users,        accent: ACCENT,    trend: 'Ce mois' },
    { label: 'Contrôles qualité',          value: '0',  unit: '',  icon: ShieldCheck,  accent: '#2dd4bf', trend: 'Ce mois' },
    { label: 'Alertes en attente',     value: '0',   unit: '',  icon: ClipboardList,accent: '#f87171', trend: '⚠ Urgent' },
    { label: 'Score de terrain',           value: '94',  unit: '%', icon: TrendingUp,   accent: '#4ade80', trend: 'Excellent' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/agent/stats');
        setStats([
          { label: 'Agriculteurs inscrits',       value: response.data.totalFarmers.toString(),  unit: '',  icon: Users,        accent: ACCENT,    trend: 'Global' },
          { label: 'Contrôles qualité',          value: response.data.qualityChecksDone.toString(),  unit: '',  icon: ShieldCheck,  accent: '#2dd4bf', trend: 'Global' },
          { label: 'Alertes routières',     value: response.data.pendingRoadAlerts.toString(),   unit: '',  icon: AlertTriangle,accent: '#f87171', trend: 'Non résolues' },
          { label: 'Score de terrain',           value: '94',  unit: '%', icon: TrendingUp,   accent: '#4ade80', trend: 'Excellent' },
        ]);
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      }
    };
    fetchStats();
  }, []);

  const validations = {
    pending: [
      { farmer: 'Rakoto Jean-Baptiste', village: 'Antsirabe',   crop: 'Riz paddy',       qty: '1 200 kg', urgency: 'high' },
      { farmer: 'Rasoa Mialy',          village: 'Betafo',      crop: 'Tomates',          qty: '80 kg',    urgency: 'normal' },
      { farmer: 'Hery Andriamahefa',    village: 'Ambatolampy', crop: 'Pommes de terre',  qty: '500 kg',   urgency: 'normal' },
    ],
    done: [
      { farmer: 'Fanja Ratsimba', village: 'Fianarantsoa', crop: 'Haricots verts', qty: '200 kg', urgency: 'done' },
      { farmer: 'Solo Randria',   village: 'Ambositra',    crop: 'Maïs',           qty: '600 kg', urgency: 'done' },
    ],
  };

  const topFarmers = [
    { name: 'Rakoto Jean',  region: 'Vakinankaratra',   score: 98, sales: '2,4M Ar', avatar: 'RJ' },
    { name: 'Fanja Farms',  region: 'Fianarantsoa',     score: 95, sales: '1,8M Ar', avatar: 'FF' },
    { name: 'Hery Agri',    region: 'Itasy',            score: 91, sales: '1,2M Ar', avatar: 'HA' },
    { name: 'Solo Randria', region: "Amoron'i Mania",   score: 88, sales: '900K Ar', avatar: 'SR' },
  ];

  const activity = [
    { action: 'Contrôle qualité effectué', detail: 'Riz — Rakoto Jean (Lot #R44)',  time: '1h',   dot: '#22d3ee' },
    { action: 'Validation approuvée',       detail: 'Tomates — Rasoa Mialy',        time: '3h',   dot: '#4ade80' },
    { action: 'Alerte signalée',            detail: 'Maladie — Maïs, Hery A.',      time: '5h',   dot: '#f87171' },
    { action: 'Nouveau fermier enregistré', detail: 'Tiana R. — Morondava',         time: 'Hier', dot: '#a78bfa' },
  ];

  const list = tab === 'pending' ? validations.pending : validations.done;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h2 className="text-white font-bold text-2xl">Bonjour, {user?.fullName || 'Agent'} 🛡️</h2>
          <p className="text-white/40 text-sm mt-1">{stats[2].value} alertes nécessitent votre attention.</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-black"
          style={{ background: 'linear-gradient(135deg,#22d3ee,#06b6d4)', boxShadow: '0 8px 24px rgba(34,211,238,0.25)' }}>
          <MapPin size={16} /> Ma zone de terrain
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

      {/* Row 2 : Validations + Colonne droite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Validations */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Demandes de Validation</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {([['pending','⏳ En attente'],['done','✅ Traitées']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={tab === k ? { background: ACCENT, color: '#000' } : { color: 'rgba(255,255,255,0.4)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {list.map((item, i) => {
              const isUrgent = item.urgency === 'high';
              const isDone   = item.urgency === 'done';
              return (
                <div key={i} className="p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: isUrgent ? '1px solid rgba(248,113,113,0.25)' : isDone ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={isDone
                          ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }
                          : isUrgent
                          ? { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
                          : { background: 'rgba(34,211,238,0.1)', color: ACCENT, border: `1px solid ${ACCENT}30` }}>
                        {item.farmer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{item.farmer}</p>
                        <p className="text-white/35 text-xs flex items-center gap-1 mt-0.5">
                          <MapPin size={9} /> {item.village}
                        </p>
                      </div>
                    </div>
                    {isDone
                      ? <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}><CheckCircle size={11} /> Validé</span>
                      : isUrgent
                      ? <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}><AlertTriangle size={11} /> Urgent</span>
                      : <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}><Clock size={11} /> En attente</span>
                    }
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{item.crop}</span>
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{item.qty}</span>
                    </div>
                    {!isDone && (
                      <div className="flex gap-2">
                        <button className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                          Rejeter
                        </button>
                        <button className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(34,211,238,0.12)', color: ACCENT, border: `1px solid ${ACCENT}30` }}>
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Colonne droite */}
        <div className="space-y-4">

          {/* Top Agriculteurs */}
          <motion.div {...card(5)} style={glass} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">Top Agriculteurs</h3>
              <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition" style={{ color: ACCENT }}>
                Voir tout <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {topFarmers.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.1)', color: ACCENT, border: `1px solid ${ACCENT}25` }}>
                    {f.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{f.name}</p>
                    <p className="text-white/35 text-xs truncate">{f.region}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end text-xs" style={{ color: '#fbbf24' }}>
                      <Star size={10} fill="currentColor" /> {f.score}
                    </div>
                    <p className="text-white/35 text-xs">{f.sales}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activités récentes */}
          <motion.div {...card(6)} style={glass} className="p-5">
            <h3 className="text-white font-bold text-sm mb-4">Activités récentes</h3>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: a.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 font-medium text-xs">{a.action}</p>
                    <p className="text-white/35 text-xs truncate mt-0.5">{a.detail}</p>
                  </div>
                  <p className="text-white/25 text-xs flex-shrink-0">il y a {a.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
