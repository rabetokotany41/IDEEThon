import React, { useState } from 'react';
import { ShoppingCart, Package, Star, Search, ArrowUpRight, Clock, CheckCircle, XCircle, Filter, TrendingDown } from 'lucide-react';
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

const ACCENT = '#60a5fa';

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState('Tous');

  const stats = [
    { label: 'Budget disponible',    value: '850 000', unit: 'Ar', icon: TrendingDown, accent: '#60a5fa', trend: 'Actif' },
    { label: 'Commandes en cours',   value: '3',       unit: '',   icon: Package,       accent: '#a78bfa', trend: '+1 nouveau' },
    { label: 'Achats ce mois',       value: '12',      unit: '',   icon: ShoppingCart,  accent: '#818cf8', trend: '+3 vs mois passé' },
    { label: 'Note acheteur',        value: '4.8',     unit: '/5', icon: Star,          accent: '#fbbf24', trend: 'Excellent' },
  ];

  const filters = ['Tous','Livré','En transit','En attente','Annulé'];
  const orders = [
    { id: '#1048', product: 'Riz blanc',      qty: '500 kg', seller: 'Rakoto Jean',  amount: '300 000 Ar', status: 'Livré',      date: '02 Juin' },
    { id: '#1052', product: 'Maïs jaune',     qty: '200 kg', seller: 'Hery Agri',    amount: '160 000 Ar', status: 'En transit', date: '04 Juin' },
    { id: '#1055', product: 'Haricots verts', qty: '80 kg',  seller: 'Coop. Beta',   amount: '96 000 Ar',  status: 'En attente', date: '05 Juin' },
    { id: '#1058', product: 'Tomates',        qty: '50 kg',  seller: 'Fanja Farms',  amount: '60 000 Ar',  status: 'Annulé',     date: '05 Juin' },
  ];
  const shown = filter === 'Tous' ? orders : orders.filter(o => o.status === filter);

  const statusConf: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
    'Livré':      { icon: <CheckCircle size={12} />, bg: 'rgba(74,222,128,0.15)',  color: '#4ade80' },
    'En transit': { icon: <Clock size={12} />,        bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
    'En attente': { icon: <Clock size={12} />,        bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24' },
    'Annulé':     { icon: <XCircle size={12} />,      bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
  };

  const suggestions = [
    { product: 'Vanille Premium', region: 'SAVA',     price: '12 000 Ar/kg', rating: 4.9 },
    { product: 'Litchi frais',    region: 'Tamatave', price: '800 Ar/kg',    rating: 4.7 },
    { product: 'Cacao bio',       region: 'Ambanja',  price: '4 500 Ar/kg',  rating: 4.8 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Jeudi, 5 Juin 2026</p>
          <h2 className="text-white font-bold text-2xl">Tableau de bord Acheteur 🛒</h2>
          <p className="text-white/40 text-sm mt-1">Gérez vos achats et explorez le marché agricole.</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 24px rgba(99,102,241,0.28)' }}>
          <Search size={16} /> Chercher des produits
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

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Commandes */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Mes Commandes</h3>
            <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition" style={{ color: ACCENT }}>
              Tout voir <ArrowUpRight size={13} />
            </button>
          </div>
          {/* Filtres */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={filter === f
                  ? { background: ACCENT, color: '#000' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {shown.map((o, i) => {
              const sc = statusConf[o.status];
              return (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
                    <Package size={16} style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">{o.product}</p>
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                        style={{ background: sc.bg, color: sc.color }}>
                        {sc.icon} {o.status}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs mt-0.5">{o.id} · {o.qty} · {o.seller}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-sm">{o.amount}</p>
                    <p className="text-white/30 text-xs">{o.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div {...card(5)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Suggestions</h3>
            <Filter size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 rounded-xl transition-all cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white font-bold text-sm">{s.product}</p>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#fbbf24' }}>
                    <Star size={11} fill="currentColor" /> {s.rating}
                  </div>
                </div>
                <p className="text-white/35 text-xs mb-3">{s.region}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: ACCENT }}>{s.price}</span>
                  <button className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-all"
                    style={{ background: 'rgba(96,165,250,0.15)', color: ACCENT, border: '1px solid rgba(96,165,250,0.25)' }}>
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
