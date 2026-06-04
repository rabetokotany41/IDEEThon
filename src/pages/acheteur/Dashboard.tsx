import React from 'react';
import { ShoppingBag, TrendingDown, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Dépenses ce mois', value: '450,000 Ar', icon: <TrendingDown size={24} />, trend: '-10%' },
    { title: 'Commandes en cours', value: '2', icon: <Package size={24} />, trend: 'En livraison' },
    { title: 'Achats validés', value: '14', icon: <ShoppingBag size={24} />, trend: '+3' },
    { title: 'Délai moyen', value: '2 Jours', icon: <Clock size={24} />, trend: 'Rapide' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-white">Mon Espace</h2>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-green-400/50 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-green-400/10 text-green-400 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('-') || stat.trend === 'Rapide' ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/70'}`}>
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

      {/* RECENT ORDERS OVERVIEW */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Suivi des livraisons</h3>
        <div className="space-y-4">
          {[
            { item: 'Maïs biologique (200kg)', status: 'En route vers Antananarivo', eta: 'Aujourd\'hui, 16h', price: '400,000 Ar' },
            { item: 'Riz rouge (50kg)', status: 'Préparation par le vendeur', eta: 'Demain', price: '90,000 Ar' },
          ].map((order, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-lg text-green-400">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-bold text-white/90">{order.item}</p>
                  <p className="text-sm text-yellow-400 mt-1">{order.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{order.price}</p>
                <p className="text-sm text-white/40 mt-1">Arrivée: {order.eta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
