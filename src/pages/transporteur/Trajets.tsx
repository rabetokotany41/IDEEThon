import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, AlertCircle, Map as MapIcon, X } from 'lucide-react';
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
  product_name?: string;
  quantity?: number;
  unit?: string;
  vehicle_type?: string;
}

interface FormattedTrajet {
  id: string;
  origine: string;
  destination: string;
  statut: string;
  progression: number;
  rawStatus: DeliveryMission['status'];
  charge?: string;
  vehicleType?: string;
}

const Trajets: React.FC = () => {
  const { user } = useAuth();
  const [trajets, setTrajets] = useState<FormattedTrajet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showMapId, setShowMapId] = useState<string | null>(null);

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
          charge: m.product_name ? `${m.quantity} ${m.unit} de ${m.product_name}` : `Commande N°${m.order_id.slice(0, 6).toUpperCase()}`,
          vehicleType: m.vehicle_type || 'Véhicule standard',
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
                      <p className="text-white/70 text-sm mt-1">
                        📦 {trajet.charge} • {trajet.vehicleType}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
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

                {/* Bouton Carte */}
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setShowMapId(showMapId === trajet.id ? null : trajet.id)}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    {showMapId === trajet.id ? <X size={16} /> : <MapIcon size={16} />}
                    {showMapId === trajet.id ? 'Masquer la carte' : 'Voir sur la carte'}
                  </button>
                </div>

                {/* Conteneur de la Carte Leaflet */}
                {showMapId === trajet.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '300px' }}
                    className="mt-4 rounded-xl overflow-hidden border border-white/10"
                  >
                    {(() => {
                      // Coordonnées déterministes basées sur l'ID pour la démo
                      const hash = trajet.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
                            <Popup>Origine : {trajet.origine}</Popup>
                          </Marker>
                          <Marker position={dest}>
                            <Popup>Destination : {trajet.destination}</Popup>
                          </Marker>
                          
                          {/* Tracé de l'itinéraire réel sur route */}
                          <RealRoute origin={origin} dest={dest} />
                        </MapContainer>
                      );
                    })()}
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Trajets;