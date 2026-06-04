import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Navigation, CheckCircle } from 'lucide-react';

const Trajets: React.FC = () => {
  const trajets = [
    { id: '#TRJ-809', origine: 'Antsirabe', destination: 'Antananarivo', statut: 'En cours', progression: 60 },
    { id: '#TRJ-808', origine: 'Fianarantsoa', destination: 'Antsirabe', statut: 'Terminé', progression: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-white">Mes Trajets</h2>
          <p className="text-white/60 mt-1">Suivez l'état de vos livraisons actuelles et passées</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="space-y-6">
          {trajets.map((trajet) => (
            <div key={trajet.id} className="bg-black/20 rounded-xl border border-white/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${trajet.statut === 'En cours' ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{trajet.origine} → {trajet.destination}</h3>
                    <p className="text-white/40 text-sm mt-1">Trajet {trajet.id}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${trajet.statut === 'En cours' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                    {trajet.statut}
                  </span>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-2">
                  <span>Départ</span>
                  <span>{trajet.progression}%</span>
                  <span>Arrivée</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trajet.progression}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${trajet.statut === 'En cours' ? 'bg-green-400' : 'bg-white/50'}`}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Trajets;
