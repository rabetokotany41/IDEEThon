import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Utilisateurs Actifs', value: '1,452', icon: <Users size={24} />, trend: '+12% vs mois dernier' },
    { title: 'Volume de Transactions', value: '25.4M Ar', icon: <TrendingUp size={24} />, trend: '+8%' },
    { title: 'Signalements (Non résolus)', value: '7', icon: <AlertTriangle size={24} />, trend: 'Action requise' },
    { title: 'Santé du système', value: '99.9%', icon: <Activity size={24} />, trend: 'Normal' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-white">Administration Globale</h2>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.title.includes('Signalements') ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.title.includes('Signalements') ? 'bg-red-400/20 text-red-400' : 'bg-green-400/20 text-green-400'}`}>
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

      {/* SYSTEM LOGS / RECENT ACTIVITY */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Logs Récentes</h3>
        <div className="space-y-4">
          {[
            { log: 'Nouvel agent inscrit (Agent Rakotomavo)', type: 'Inscription', time: 'Il y a 10 min' },
            { log: 'Alerte: Erreur de synchronisation météo', type: 'Système', time: 'Il y a 1h' },
            { log: 'Validation de la coopérative Beta par Agent 02', type: 'Opération', time: 'Il y a 3h' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div>
                <p className="font-bold text-white/90">{item.log}</p>
                <p className="text-sm text-white/50 mt-1">Type: {item.type}</p>
              </div>
              <p className="text-sm text-white/40">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
