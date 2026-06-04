import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, CheckSquare, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Agriculteurs vérifiés', value: '124', icon: <Users size={24} />, trend: '+12 ce mois' },
    { title: 'Contrôles qualité', value: '45', icon: <ShieldCheck size={24} />, trend: 'En cours' },
    { title: 'Signalements', value: '2', icon: <AlertTriangle size={24} />, trend: 'À traiter' },
    { title: 'Tâches terminées', value: '89%', icon: <CheckSquare size={24} />, trend: 'Excellent' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-white">Tableau de bord - Agent Terrain</h2>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.title === 'Signalements' ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.title === 'Signalements' ? 'bg-red-400/20 text-red-400' : 'bg-green-400/20 text-green-400'}`}>
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

      {/* TASKS */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Tâches du jour</h3>
        <div className="space-y-4">
          {[
            { task: 'Visite de certification', detail: 'Ferme de Rakoto (Itasy)', time: '09:00', status: 'En attente' },
            { task: 'Contrôle qualité (Maïs)', detail: 'Coopérative Beta', time: '14:30', status: 'À faire' },
            { task: 'Vérification de profil', detail: 'Nouveau vendeur inscrit', time: '16:00', status: 'À faire' },
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded border-2 border-white/20 flex items-center justify-center">
                  {/* Empty checkbox */}
                </div>
                <div>
                  <p className="font-bold text-white/90">{task.task}</p>
                  <p className="text-sm text-white/50 mt-1">{task.detail} • {task.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
