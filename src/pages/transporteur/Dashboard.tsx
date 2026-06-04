import React from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Navigation, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Revenus (Ce mois)', value: '850,000 Ar', icon: <DollarSign size={24} />, trend: '+15%' },
    { title: 'Trajets en cours', value: '1', icon: <Truck size={24} />, trend: 'Antsirabe -> Tana' },
    { title: 'Missions en attente', value: '5', icon: <MapPin size={24} />, trend: 'Nouvelles' },
    { title: 'Distance totale', value: '1,240 km', icon: <Navigation size={24} />, trend: 'Stable' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-white">Tableau de bord - Transporteur</h2>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') || stat.trend === 'Nouvelles' ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/70'}`}>
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

      {/* ACTIVE TRIP */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5">
          <Truck size={200} />
        </div>
        <h3 className="text-xl font-bold text-white mb-6 relative z-10">Trajet Actuel</h3>
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-0.5 h-12 bg-white/20"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Départ</p>
                  <p className="text-white font-bold text-lg">Ferme Vakinankaratra (Antsirabe)</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Arrivée estimée: 16h30</p>
                  <p className="text-green-400 font-bold text-lg">Marché d'Anosibe (Antananarivo)</p>
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <p className="text-white/60 text-sm mb-1">Cargaison</p>
              <p className="text-white font-bold text-lg">2.5 Tonnes (Légumes mixtes)</p>
              <button className="mt-4 px-6 py-2 bg-green-400/20 text-green-400 hover:bg-green-400 hover:text-black font-bold rounded-lg transition border border-green-400/30">
                Ouvrir GPS
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
