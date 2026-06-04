import React from 'react';
import { Sprout, TrendingUp, DollarSign, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Revenus du mois', value: '1,250,000 Ar', icon: <DollarSign size={24} />, trend: '+12%' },
    { title: 'Produits en vente', value: '4', icon: <Sprout size={24} />, trend: 'Stable' },
    { title: 'Ventes réalisées', value: '18', icon: <TrendingUp size={24} />, trend: '+5%' },
    { title: 'Météo (Aujourd\'hui)', value: '24°C, Pluvieux', icon: <CloudRain size={24} />, trend: 'Idéal' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-white">Tableau de bord</h2>
        <button className="px-4 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 transition">
          + Nouvelle Récolte
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') || stat.trend === 'Idéal' ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/70'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-white/50 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Activités récentes</h3>
        <div className="space-y-4">
          {[
            { action: 'Vente confirmée', details: '200kg de Maïs à Coopérative Beta', time: 'Il y a 2h', amount: '+ 400,000 Ar' },
            { action: 'Produit ajouté', details: 'Tomates fraîches (50kg)', time: 'Hier', amount: '' },
            { action: 'Paiement reçu', details: 'Virement Mvola pour la commande #1042', time: 'Il y a 2 jours', amount: '+ 150,000 Ar' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div>
                <p className="font-bold text-white/90">{item.action}</p>
                <p className="text-sm text-white/50 mt-1">{item.details}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/40 mb-1">{item.time}</p>
                {item.amount && <p className="font-bold text-green-400">{item.amount}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
