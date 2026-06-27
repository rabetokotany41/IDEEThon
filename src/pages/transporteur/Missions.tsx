import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Package, DollarSign, AlertCircle, Truck, Map as MapIcon, X } from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour dessiner le trajet réel via OSRM
const RealRoute = ({ origin, dest }: { origin: [number, number], dest: [number, number] }) => {
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState<string>('');
  const map = useMap();

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM attend lng,lat
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`);
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          // Convertir de [lng, lat] à [lat, lng] pour Leaflet
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          setRoutePath(coordinates);
          setDistanceKm((route.distance / 1000).toFixed(1) + ' km');
          
          // Ajuster la vue pour voir tout le trajet
          const bounds = L.latLngBounds([origin, dest]);
          coordinates.forEach((c: [number, number]) => bounds.extend(c));
          map.fitBounds(bounds, { padding: [50, 50] });
        } else {
          // Fallback ligne droite
          setRoutePath([origin, dest]);
        }
      } catch (err) {
        console.error("Erreur OSRM:", err);
        setRoutePath([origin, dest]);
      }
    };
    fetchRoute();
  }, [origin, dest, map]);

  if (routePath.length === 0) return null;

  return (
    <Polyline positions={routePath} pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.8 }}>
      {distanceKm && (
        <Tooltip permanent direction="top" className="bg-white/90 text-blue-600 border border-blue-200 rounded-lg font-bold shadow-lg">
          {distanceKm}
        </Tooltip>
      )}
    </Polyline>
  );
};

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
  vehicleType: string;
}

const Missions: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<FormattedMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [showMapId, setShowMapId] = useState<string | null>(null);

  const fetchAvailableMissions = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Récupère les missions sans transporteur affecté et avec statut PENDING ou PREPARING
      const response = await api.get<any[]>('/delivery/missions/available');
      const formatted = response.data.map((m) => ({
        id: m.id,
        depart: m.origin,
        arrivee: m.destination,
        distance: m.distance ? `${m.distance} km` : 'Distance non renseignée',
        charge: m.product_name ? `${m.quantity} ${m.unit} de ${m.product_name}` : `Commande N°${m.order_id.slice(0, 6).toUpperCase()}`,
        vehicleType: m.vehicle_type || 'Véhicule standard',
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
            const urgency = getUrgencyLevel(mission.date);
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
                  <div className="flex flex-wrap gap-y-2 justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/70 w-full">
                      <Package size={16} className="text-orange-400" /> {mission.charge}
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Truck size={16} className="text-blue-400" /> Requis: {mission.vehicleType}
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Navigation size={16} className="text-green-400" /> {mission.date}
                    </div>
                  </div>

                  {/* Bouton Carte */}
                  <div className="mt-2 border-t border-white/5 flex justify-end pt-2">
                    <button
                      onClick={() => setShowMapId(showMapId === mission.id ? null : mission.id)}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      {showMapId === mission.id ? <X size={16} /> : <MapIcon size={16} />}
                      {showMapId === mission.id ? 'Masquer la carte' : 'Voir sur la carte'}
                    </button>
                  </div>

                  {/* Conteneur de la Carte Leaflet */}
                  {showMapId === mission.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: '250px' }}
                      className="mt-2 rounded-xl overflow-hidden border border-white/10"
                    >
                      {(() => {
                        // Coordonnées déterministes basées sur l'ID pour la démo
                        const hash = mission.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const baseLat = -18.8792; // Antananarivo
                        const baseLng = 47.5079;
                        
                        const originLat = baseLat + ((hash % 100) / 1500);
                        const originLng = baseLng - (((hash * 2) % 100) / 1500);
                        const destLat = baseLat - (((hash * 3) % 100) / 1500);
                        const destLng = baseLng + (((hash * 4) % 100) / 1500);
                        
                        const origin: [number, number] = [originLat, originLng];
                        const dest: [number, number] = [destLat, destLng];
                        const center: [number, number] = [(originLat + destLat) / 2, (originLng + destLng) / 2];

                        return (
                          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', background: '#e5e5e5' }}>
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={origin}>
                              <Popup>Origine : {mission.depart}</Popup>
                            </Marker>
                            <Marker position={dest}>
                              <Popup>Destination : {mission.arrivee}</Popup>
                            </Marker>
                            
                            {/* Tracé de l'itinéraire réel sur route */}
                            <RealRoute origin={origin} dest={dest} />
                          </MapContainer>
                        );
                      })()}
                    </motion.div>
                  )}

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