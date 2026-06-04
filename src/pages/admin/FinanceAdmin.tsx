import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, CheckCircle, XCircle } from 'lucide-react';

const FinanceAdmin: React.FC = () => {
  const demandes = [
    { id: '#PRT-4093', demandeur: 'Coopérative Beta', montant: '1,500,000 Ar', duree: '12 Mois', objet: 'Achat Motoculteur', statut: 'En attente' },
    { id: '#PRT-4094', demandeur: 'Jean Rakoto', montant: '500,000 Ar', duree: '6 Mois', objet: 'Semences hybrides', statut: 'En attente' },
    { id: '#PRT-4092', demandeur: 'Ferme Vakinankaratra', montant: '2,000,000 Ar', duree: '12 Mois', objet: 'Installation irrigation', statut: 'Validé' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white flex items-center gap-3">
            <Wallet className="text-green-400" size={32} />
            Gestion des Microcrédits
          </h2>
          <p className="text-white/60 mt-1">Validez et suivez les financements des agriculteurs.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une demande..." 
            className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">Demande & Objet</th>
                <th className="p-4 font-medium">Demandeur</th>
                <th className="p-4 font-medium">Montant & Durée</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande) => (
                <tr key={demande.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4">
                    <p className="font-bold text-white">{demande.id}</p>
                    <p className="text-white/50 text-xs mt-1">{demande.objet}</p>
                  </td>
                  <td className="p-4 text-white/80">{demande.demandeur}</td>
                  <td className="p-4">
                    <p className="font-bold text-green-400">{demande.montant}</p>
                    <p className="text-white/50 text-xs mt-1">{demande.duree}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      demande.statut === 'Validé' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {demande.statut}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    {demande.statut === 'En attente' && (
                      <>
                        <button className="p-2 bg-green-400/10 hover:bg-green-400/30 rounded-lg text-green-400 transition" title="Valider">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition" title="Refuser">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceAdmin;
