import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useRouteStore } from '../../store/slices/routeSlice';
import { useAuthStore } '../../store/slices/authSlice';
import { RouteEtat } from '../../store/models/route.model';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const CarteRoutes: React.FC = () => {
  const { user } = useAuthStore();
  const { routes, loadRoutes, isLoading, createRoute } = useRouteStore();
  const [selectedEtat, setSelectedEtat] = useState<RouteEtat | 'tous'>('tous');
  const [showSignalementForm, setShowSignalementForm] = useState(false);
  const [newSignalement, setNewSignalement] = useState({
    etat: 'bonne' as RouteEtat,
    comment: '',
  });

  useEffect(() => {
    loadRoutes(user?.region);
  }, [user, loadRoutes]);

  const getEtatColor = (etat: RouteEtat) => {
    switch (etat) {
      case 'bonne':
        return '#22c55e';
      case 'degradee':
        return '#f59e0b';
      case 'impraticable':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getEtatLabel = (etat: RouteEtat) => {
    switch (etat) {
      case 'bonne':
        return 'Bonne';
      case 'degradee':
        return 'Dégradée';
      case 'impraticable':
        return 'Impraticable';
      default:
        return etat;
    }
  };

  const filteredRoutes = selectedEtat === 'tous'
    ? routes
    : routes.filter((r) => r.etat === selectedEtat);

  const handleSignalement = async () => {
    if (!user) return;

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await createRoute({
        userId: user.id,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        etat: newSignalement.etat,
        comment: newSignalement.comment,
      });

      setShowSignalementForm(false);
      setNewSignalement({ etat: 'bonne', comment: '' });
      alert('Signalement envoyé avec succès !');
    } catch (error) {
      alert('Erreur lors du signalement');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Carte des routes</h1>
          <p className="text-gray-600">Signalez et consultez l'état des routes</p>
        </CardHeader>
        <CardBody>
          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedEtat === 'tous' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedEtat('tous')}
            >
              Tous
            </Button>
            <Button
              variant={selectedEtat === 'bonne' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedEtat('bonne')}
            >
              ✅ Bonne
            </Button>
            <Button
              variant={selectedEtat === 'degradee' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedEtat('degradee')}
            >
              ⚠️ Dégradée
            </Button>
            <Button
              variant={selectedEtat === 'impraticable' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedEtat('impraticable')}
            >
              ❌ Impraticable
            </Button>
          </div>

          {/* Carte */}
          <div className="h-96 rounded-lg overflow-hidden mb-4">
            <MapContainer
              center={[user?.region === 'Analamanga' ? -18.8792 : -18.8792, 47.5079]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {filteredRoutes.map((route) => (
                <React.Fragment key={route.id}>
                  <Circle
                    center={[route.location.lat, route.location.lng]}
                    radius={500}
                    pathOptions={{ color: getEtatColor(route.etat), fillOpacity: 0.3 }}
                  />
                  <Marker position={[route.location.lat, route.location.lng]}>
                    <Popup>
                      <div>
                        <strong>{getEtatLabel(route.etat)}</strong>
                        {route.comment && <p className="text-sm mt-1">{route.comment}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(route.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          {/* Formulaire de signalement */}
          {showSignalementForm && (
            <Card className="mb-4">
              <CardBody>
                <h3 className="font-semibold mb-4">Signaler l'état d'une route</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      État de la route
                    </label>
                    <select
                      value={newSignalement.etat}
                      onChange={(e) => setNewSignalement({ ...newSignalement, etat: e.target.value as RouteEtat })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="bonne">✅ Bonne</option>
                      <option value="degradee">⚠️ Dégradée</option>
                      <option value="impraticable">❌ Impraticable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      value={newSignalement.comment}
                      onChange={(e) => setNewSignalement({ ...newSignalement, comment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Décrivez l'état de la route..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSignalement} isLoading={isLoading}>
                      Envoyer le signalement
                    </Button>
                    <Button variant="outline" onClick={() => setShowSignalementForm(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Légende */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Bonne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Dégradée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Impraticable</span>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={() => setShowSignalementForm(!showSignalementForm)} fullWidth>
            {showSignalementForm ? 'Annuler' : '📍 Signaler une route'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
