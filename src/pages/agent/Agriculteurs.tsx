import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Search, MapPin } from 'lucide-react';

const Agriculteurs: React.FC = () => {
  const agriculteurs = [
    { id: 1, nom: 'Jean Rakoto', lieu: 'Itasy', ferme: 'Ferme Valisoa', statut: 'Vérifié', date_inscription: '12 Sep 2023' },
    { id: 2, nom: 'Marie Rasoa', lieu: 'Vakinankaratra', ferme: 'Coopérative Beta', statut: 'En attente', date_inscription: '10 Oct 2023' },
    { id: 3, nom: 'Andry', lieu: 'Analamanga', ferme: 'Les Rizières', statut: 'Rejeté', date_inscription: '05 Oct 2023' },
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
          <h2 className="text-3xl font-serif text-white">Gestion des Agriculteurs</h2>
          <p className="text-white/60 mt-1">Vérification et certification des profils</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">Nom & Ferme</th>
                <th className="p-4 font-medium">Localisation</th>
                <th className="p-4 font-medium">Inscription</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agriculteurs.map((agri) => (
                <tr key={agri.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4">
                    <p className="font-bold text-white">{agri.nom}</p>
                    <p className="text-white/50 text-xs mt-1">{agri.ferme}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-white/80">
                      <MapPin size={14} className="text-green-400" /> {agri.lieu}
                    </div>
                  </td>
                  <td className="p-4 text-white/50 text-sm">{agri.date_inscription}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      agri.statut === 'Vérifié' ? 'bg-green-400/20 text-green-400' : 
                      agri.statut === 'En attente' ? 'bg-yellow-400/20 text-yellow-400' : 
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {agri.statut}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button className="p-2 bg-green-400/10 hover:bg-green-400/30 rounded-lg text-green-400 transition" title="Valider">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition" title="Rejeter">
                      <XCircle size={18} />
                    </button>
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

export default Agriculteurs;
