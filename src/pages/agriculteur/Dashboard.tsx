import React, { useState } from 'react';
import { Sprout, TrendingUp, DollarSign, CloudRain, Plus, ArrowUpRight, Leaf, Sun, Wind, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Shared card style ── */
const glass = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
} as React.CSSProperties;

const card = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
});

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<'semaine' | 'mois'>('semaine');

  const stats = [
    { label: 'Revenus du mois', value: '1,250,000', unit: 'Ar', icon: DollarSign, trend: '+12%', up: true, accent: '#4ade80' },
    { label: 'Produits en vente', value: '4', unit: '', icon: Sprout, trend: 'Stable', up: true, accent: '#34d399' },
    { label: 'Ventes réalisées', value: '18', unit: '', icon: TrendingUp, trend: '+5%', up: true, accent: '#6ee7b7' },
    { label: 'Météo aujourd\'hui', value: '24°C', unit: '', icon: CloudRain, trend: 'Idéal', up: true, accent: '#7dd3fc' },
  ];

  const products = [
    { name: 'Maïs', qty: '450 kg', price: '800 Ar/kg', status: 'En vente', pct: 72 },
    { name: 'Tomates', qty: '80 kg', price: '1 200 Ar/kg', status: 'Limité', pct: 35 },
    { name: 'Riz', qty: '1 200 kg', price: '600 Ar/kg', status: 'En vente', pct: 88 },
  ];

  const activities = [
    { action: 'Vente confirmée', details: '200 kg de Maïs → Coopérative Beta', time: '2h', amount: '+160 000 Ar' },
    { action: 'Produit ajouté', details: 'Tomates fraîches (50 kg)', time: 'Hier', amount: '' },
    { action: 'Paiement reçu', details: 'Mvola — Commande #1042', time: '2j', amount: '+150 000 Ar' },
    { action: 'Alerte météo', details: 'Pluies — Vakinankaratra', time: '3j', amount: '' },
  ];

  const bars = [40, 65, 50, 80, 55, 90, 70];
  const barsMois = [55, 70, 60, 85, 75, 95, 80, 65, 70, 88, 60, 78];
  const labels = tab === 'semaine' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['J1', 'J5', 'J10', 'J15', 'J20', 'J25', 'J30', 'J5', 'J10', 'J15', 'J20', 'J25'];
  const data = tab === 'semaine' ? bars : barsMois;
  const maxB = Math.max(...data);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium mb-1 uppercase tracking-widest">Jeudi, 5 Juin 2026</p>
          <h2 className="text-white font-bold text-2xl leading-tight">Bonjour, Rakoto 👋</h2>
          <p className="text-white/40 text-sm mt-1">Voici un aperçu de votre exploitation aujourd'hui.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10">
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...card(i)} style={glass} className="p-5 flex flex-col gap-4 hover:border-white/16 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.accent + '1a', border: `1px solid ${s.accent}30` }}>
                  <Icon size={19} style={{ color: s.accent }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: s.accent + '18', color: s.accent }}>
                  {s.trend}
                </span>
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

      {/* ── Row 2 : Graph + Météo ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Graph */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Performance</p>
              <h3 className="text-white font-bold text-lg">Ventes</h3>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {(['semaine', 'mois'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={tab === t
                    ? { background: '#4ade80', color: '#000' }
                    : { color: 'rgba(255,255,255,0.4)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: 96 }}>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(v / maxB) * 100}%` }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{ background: 'linear-gradient(to top,#4ade80,#86efac60)' }} />
                </div>
                <span className="text-white/30 text-[10px]">{labels[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Météo */}
        <motion.div {...card(5)} className="p-6 flex flex-col gap-4"
          style={{ ...glass, background: 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(14,165,233,0.06))', border: '1px solid rgba(56,189,248,0.18)' }}>
          <div>
            <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Météo locale</p>
            <h3 className="text-white font-bold text-lg">Vakinankaratra</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>
              <CloudRain size={28} className="text-sky-300" />
            </div>
            <div>
              <p className="text-white font-bold text-4xl leading-none">24°</p>
              <p className="text-sky-300/80 text-sm mt-0.5">Pluvieux</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Sun size={14} className="text-yellow-400" />, label: 'UV Index', val: 'Modéré' },
              { icon: <Wind size={14} className="text-sky-400" />, label: 'Vent', val: '12 km/h' },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {w.icon}
                <div>
                  <p className="text-white/35 text-[10px]">{w.label}</p>
                  <p className="text-white font-semibold text-xs">{w.val}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs text-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            ✅ Favorable pour la récolte demain
          </p>
        </motion.div>
      </div>

      {/* ── Row 3 : Produits + Activités ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Produits */}
        <motion.div {...card(6)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-base">Mes Produits</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:opacity-80 transition">
              Voir tout <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="space-y-4">
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <Leaf size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Limité' ? 'text-orange-400 bg-orange-400/15' : 'text-emerald-400 bg-emerald-400/15'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/35 mb-2">
                    <span>{p.qty}</span><span>{p.price}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.status === 'Limité' ? '#fb923c' : 'linear-gradient(90deg,#4ade80,#22d3ee)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activités */}
        <motion.div {...card(7)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-base">Activités récentes</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:opacity-80 transition">
              Historique <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${a.amount ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{a.action}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{a.details}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white/25 text-xs">Il y a {a.time}</p>
                  {a.amount && <p className="text-emerald-400 font-bold text-xs mt-0.5">{a.amount}</p>}
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
