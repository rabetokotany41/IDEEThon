import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Package, DollarSign, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// Types correspondant à la base de données
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

interface FormattedMission {
  id: string;
  depart: string;
  arrivee: string;
  distance: string;
  charge: string;
  prix: string;
  date: string;
  orderId: string;
}

const Missions: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<FormattedMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchAvailableMissions = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Récupère les missions sans transporteur affecté et avec statut PENDING ou PREPARING
      const response = await api.get<DeliveryMission[]>('/delivery/missions/available');
      const formatted = response.data.map((m) => ({
        id: m.id,
        depart: m.origin,
        arrivee: m.destination,
        distance: m.distance ? `${m.distance} km` : 'Distance non renseignée',
        charge: `Commande N°${m.order_id.slice(0, 6).toUpperCase()}`,
        prix: m.delivery_price.toLocaleString('fr-MG') + ' Ar',
        date: new Date(m.created_at).toLocaleDateString('fr-FR'),
        orderId: m.order_id,
      }));
      setMissions(formatted);
    } catch (error) {
      console.error('Erreur chargement missions disponibles:', error);
      setError('Impossible de charger les missions. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableMissions();
  }, [user]);

  const handleAccept = async (missionId: string) => {
    if (!user) return;
    setAcceptingId(missionId);
    try {
      await api.patch(`/delivery/missions/${missionId}/assign`, { transporterId: user.id });
      alert('Mission acceptée avec succès !');
      // Rafraîchir la liste
      fetchAvailableMissions();
    } catch (error) {
      console.error('Erreur acceptation mission:', error);
      alert("Erreur lors de l'acceptation de la mission. Vérifiez que vous êtes connecté.");
    } finally {
      setAcceptingId(null);
    }
  };

  // Calcul du niveau d'urgence fictif basé sur la date (optionnel)
  const getUrgencyLevel = (createdAt: string): { label: string; className: string } => {
    const daysOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 3600 * 24);
    if (daysOld > 3) return { label: 'Haute', className: 'bg-yellow-400/20 text-yellow-400' };
    if (daysOld > 1) return { label: 'Normale', className: 'bg-blue-400/20 text-blue-400' };
    return { label: 'Basse', className: 'bg-green-400/20 text-green-400' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Missions Disponibles</h2>
        <p className="text-white/60 mt-1">Trouvez des trajets adaptés à votre véhicule</p>
      </div>

      {loading ? (
        <div className="text-center text-white/50 py-10">Recherche de missions...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button
            onClick={fetchAvailableMissions}
            className="mt-2 px-4 py-2 bg-orange-400/20 text-orange-400 rounded-lg text-sm"
          >
            Réessayer
          </button>
        </div>
      ) : missions.length === 0 ? (
        <div className="col-span-full text-center text-white/50 py-10">
          Aucune mission disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const urgency = getUrgencyLevel(mission.date); // simplifié, on utilise la date créée
            return (
              <div
                key={mission.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-orange-400/50 transition group"
              >
                <div className="p-5 border-b border-white/5 bg-black/20">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgency.className}`}>
                      Urgence: {urgency.label}
                    </span>
                    <span className="text-orange-400 font-bold flex items-center gap-1">
                      <DollarSign size={16} /> {mission.prix}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-0.5 h-6 bg-white/20"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-white font-bold">{mission.depart}</p>
                      <p className="text-white/40 text-xs my-1">↓ {mission.distance}</p>
                      <p className="text-orange-400 font-bold">{mission.arrivee}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Package size={16} /> {mission.charge}
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Navigation size={16} /> {mission.date}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(mission.id)}
                    disabled={acceptingId === mission.id}
                    className={`w-full py-3 rounded-lg font-bold transition mt-2 ${
                      acceptingId === mission.id
                        ? 'bg-gray-600 text-white cursor-not-allowed'
                        : 'bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400 hover:text-black'
                    }`}
                  >
                    {acceptingId === mission.id ? 'Acceptation...' : 'Accepter la mission'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Missions;