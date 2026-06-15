import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// Types correspondant à la table delivery_missions
interface DeliveryMission {
  id: string;
  origin: string;
  destination: string;
  distance: number | null;
  status: 'PENDING' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  delivery_price: number;
  order_id: string;
  transporter_id: string | null;
  created_at: string;
}

interface FormattedTrajet {
  id: string;
  origine: string;
  destination: string;
  statut: string;
  progression: number;
  rawStatus: DeliveryMission['status'];
}

const Trajets: React.FC = () => {
  const { user } = useAuth();
  const [trajets, setTrajets] = useState<FormattedTrajet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTrajets = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Récupérer toutes les missions assignées à ce transporteur
      const response = await api.get<DeliveryMission[]>(`/delivery/missions?transporterId=${user.id}`);
      const formatted = response.data.map((m) => {
        let statut = '';
        let progression = 0;
        switch (m.status) {
          case 'PENDING':
            statut = 'En attente';
            progression = 0;
            break;
          case 'PREPARING':
            statut = 'Préparation';
            progression = 25;
            break;
          case 'IN_TRANSIT':
            statut = 'En cours';
            progression = 75;
            break;
          case 'DELIVERED':
            statut = 'Terminé';
            progression = 100;
            break;
          case 'CANCELLED':
            statut = 'Annulé';
            progression = 0;
            break;
          default:
            statut = m.status;
            progression = 0;
        }
        return {
          id: m.id,
          origine: m.origin,
          destination: m.destination,
          statut,
          progression,
          rawStatus: m.status,
        };
      });
      // Trier : d'abord les missions non terminées, puis les terminées
      formatted.sort((a, b) => {
        if (a.rawStatus === 'DELIVERED' && b.rawStatus !== 'DELIVERED') return 1;
        if (a.rawStatus !== 'DELIVERED' && b.rawStatus === 'DELIVERED') return -1;
        return 0;
      });
      setTrajets(formatted);
    } catch (error) {
      console.error('Erreur chargement des trajets:', error);
      setError('Impossible de charger vos missions. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajets();
  }, [user]);

  const handleDeliver = async (missionId: string) => {
    if (!window.confirm('Confirmer la livraison finale de cette commande ?')) return;
    setUpdatingId(missionId);
    try {
      await api.patch(`/delivery/missions/${missionId}/status`, { status: 'DELIVERED' });
      alert('Mission marquée comme livrée !');
      fetchTrajets(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
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
          ) : error ? (
            <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
              <AlertCircle size={32} />
              <p>{error}</p>
              <button
                onClick={fetchTrajets}
                className="mt-2 px-4 py-2 bg-orange-400/20 text-orange-400 rounded-lg text-sm"
              >
                Réessayer
              </button>
            </div>
          ) : trajets.length === 0 ? (
            <div className="text-center text-white/50 py-10">
              Aucun trajet en cours ou terminé.
            </div>
          ) : (
            trajets.map((trajet) => (
              <div key={trajet.id} className="bg-black/20 rounded-xl border border-white/5 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        trajet.statut === 'En cours' || trajet.statut === 'Préparation'
                          ? 'bg-orange-400/20 text-orange-400'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {trajet.origine} → {trajet.destination}
                      </h3>
                      <p className="text-white/40 text-sm mt-1">
                        Trajet #{trajet.id.slice(0, 6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trajet.statut === 'En cours'
                          ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                          : trajet.statut === 'Terminé'
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-white/10 text-white/50 border border-white/10'
                      }`}
                    >
                      {trajet.statut}
                    </span>
                    {trajet.rawStatus !== 'DELIVERED' && trajet.rawStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => handleDeliver(trajet.id)}
                        disabled={updatingId === trajet.id}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
                      >
                        <CheckCircle size={14} />{' '}
                        {updatingId === trajet.id ? 'Mise à jour...' : 'Marquer Livré'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Barre de progression */}
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
                      className={`h-full ${
                        trajet.progression === 100
                          ? 'bg-white/50'
                          : 'bg-orange-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Trajets;