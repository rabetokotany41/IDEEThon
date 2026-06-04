import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle } from 'lucide-react';

const Commandes: React.FC = () => {
  const commandes = [
    { id: '#CMD-1042', produit: 'Maïs biologique (200kg)', vendeur: 'Coopérative Beta', total: '400,000 Ar', statut: 'En route', date: 'Aujourd\'hui, 14:30', etape: 2 },
    { id: '#CMD-1043', produit: 'Tomates rondes (20kg)', vendeur: 'Jean Rakoto', total: '60,000 Ar', statut: 'Préparation', date: 'Aujourd\'hui, 10:00', etape: 1 },
    { id: '#CMD-1020', produit: 'Riz rouge (50kg)', vendeur: 'Coop. Analamanga', total: '90,000 Ar', statut: 'Livré', date: '01 Oct 2023', etape: 3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Mes Commandes</h2>
        <p className="text-white/60 mt-1">Suivi de vos achats et livraisons</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-6">
        <div className="space-y-6">
          {commandes.map((cmd) => (
            <div key={cmd.id} className="bg-black/20 rounded-xl border border-white/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">{cmd.produit}</h3>
                  <p className="text-white/60 text-sm">Vendeur: {cmd.vendeur} • {cmd.id}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold text-green-400">{cmd.total}</p>
                  <p className="text-white/40 text-xs mt-1">{cmd.date}</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="relative pt-4">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: cmd.etape === 1 ? '10%' : cmd.etape === 2 ? '50%' : '100%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-green-400"
                  />
                </div>
                <div className="relative flex justify-between">
                  <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 1 ? 'text-green-400' : 'text-white/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 1 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                      <Package size={16} />
                    </div>
                    <span className="text-xs font-bold hidden sm:block">Préparation</span>
                  </div>
                  <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 2 ? 'text-green-400' : 'text-white/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 2 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                      <Truck size={16} />
                    </div>
                    <span className="text-xs font-bold hidden sm:block">En route</span>
                  </div>
                  <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 3 ? 'text-green-400' : 'text-white/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 3 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-xs font-bold hidden sm:block">Livré</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Commandes;
