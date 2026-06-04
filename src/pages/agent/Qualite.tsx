import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Search, Clock } from 'lucide-react';

const Qualite: React.FC = () => {
  const controles = [
    { id: '#QC-001', produit: 'Maïs (Lot 1042)', agriculteur: 'Jean Rakoto', statut: 'Conforme', date: 'Aujourd\'hui', agent: 'Vous' },
    { id: '#QC-002', produit: 'Tomates rondes', agriculteur: 'Coop. Analamanga', statut: 'À vérifier', date: 'Aujourd\'hui', agent: 'Vous' },
    { id: '#QC-003', produit: 'Riz rouge', agriculteur: 'Ferme Vakinankaratra', statut: 'Non conforme', date: 'Hier', agent: 'Agent Rakotomavo' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Contrôle Qualité</h2>
          <p className="text-white/60 mt-1">Inspection des produits avant expédition</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un lot..." 
            className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {controles.map((ctrl) => (
            <div key={ctrl.id} className="bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  ctrl.statut === 'Conforme' ? 'bg-green-400/20 text-green-400' :
                  ctrl.statut === 'À vérifier' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {ctrl.statut === 'Conforme' ? <CheckCircle size={20} /> :
                   ctrl.statut === 'À vérifier' ? <Clock size={20} /> :
                   <ShieldAlert size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-white">{ctrl.produit}</h3>
                  <p className="text-white/60 text-sm mt-1">{ctrl.agriculteur} • Lot {ctrl.id}</p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  ctrl.statut === 'Conforme' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                  ctrl.statut === 'À vérifier' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                  'bg-red-400/10 text-red-400 border border-red-400/20'
                }`}>
                  {ctrl.statut}
                </span>
                <p className="text-white/40 text-xs mt-2 hidden sm:block">Date: {ctrl.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Qualite;
