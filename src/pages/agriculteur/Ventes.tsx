import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const Ventes: React.FC = () => {
  const ventes = [
    { id: '#CMD-1042', client: 'Coopérative Beta', produit: 'Maïs biologique (200kg)', total: '400,000 Ar', statut: 'Livré', date: 'Aujourd\'hui, 14:30' },
    { id: '#CMD-1041', client: 'Supermarché Leader', produit: 'Tomates (50kg)', total: '175,000 Ar', statut: 'En transit', date: 'Hier, 09:15' },
    { id: '#CMD-1040', client: 'Restaurant Le Chef', produit: 'Riz rouge (100kg)', total: '180,000 Ar', statut: 'En attente', date: '12 Oct 2023' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Historique des Ventes</h2>
        <p className="text-white/60 mt-1">Suivez l'état de vos commandes et vos revenus</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-6">
        <div className="space-y-4">
          {ventes.map((vente) => (
            <div key={vente.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition gap-4">
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  vente.statut === 'Livré' ? 'bg-green-400/20 text-green-400' :
                  vente.statut === 'En transit' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-blue-400/20 text-blue-400'
                }`}>
                  {vente.statut === 'Livré' ? <CheckCircle size={24} /> :
                   vente.statut === 'En transit' ? <Clock size={24} /> :
                   <FileText size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{vente.client}</h3>
                  <p className="text-white/70 text-sm mt-1">{vente.produit}</p>
                  <p className="text-white/40 text-xs mt-1">Commande {vente.id} • {vente.date}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                <p className="text-xl font-bold text-green-400">{vente.total}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  vente.statut === 'Livré' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                  vente.statut === 'En transit' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                  'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                }`}>
                  {vente.statut}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Ventes;
