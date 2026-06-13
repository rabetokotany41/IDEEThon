import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Trajets: React.FC = () => {
  const { user } = useAuth();
  const [trajets, setTrajets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrajets = async () => {
    try {
      if (!user) return;
      const response = await api.get(`/delivery/transporter/${user.id}`);
      const formatted = response.data.map((m: any) => ({
        id: m.id,
        origine: m.origin,
        destination: m.destination,
        statut: m.status === 'DELIVERED' ? 'Terminé' : 'En cours',
        progression: m.status === 'DELIVERED' ? 100 : 50,
      }));
      setTrajets(formatted);
    } catch (error) {
      console.error('Error fetching trajets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajets();
  }, [user]);

  const handleDeliver = async (missionId: string) => {
    if (!window.confirm("Confirmer la livraison finale de cette commande ?")) return;
    try {
      await api.patch(`/delivery/${missionId}/status`, { status: 'DELIVERED' });
      alert('Mission marquée comme livrée !');
      fetchTrajets();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

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
          {loading ? (
            <div className="text-center text-white/50 py-10">Chargement de vos trajets...</div>
          ) : trajets.length === 0 ? (
            <div className="text-center text-white/50 py-10">Aucun trajet en cours ou terminé.</div>
          ) : trajets.map((trajet) => (
            <div key={trajet.id} className="bg-black/20 rounded-xl border border-white/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${trajet.statut === 'En cours' ? 'bg-orange-400/20 text-orange-400' : 'bg-white/10 text-white/50'}`}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{trajet.origine} → {trajet.destination}</h3>
                    <p className="text-white/40 text-sm mt-1">Trajet #{trajet.id.slice(0,6).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${trajet.statut === 'En cours' ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                    {trajet.statut}
                  </span>
                  {trajet.statut === 'En cours' && (
                    <button 
                      onClick={() => handleDeliver(trajet.id)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition"
                    >
                      <CheckCircle size={14} /> Marquer Livré
                    </button>
                  )}
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
                    className={`h-full ${trajet.statut === 'En cours' ? 'bg-orange-400' : 'bg-white/50'}`}
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
