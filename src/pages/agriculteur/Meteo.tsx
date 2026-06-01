import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Select } from '../../components/forms/Select';
import { useMeteoStore } from '../../store/slices/meteoSlice';
import { useAuthStore } from '../../store/slices/authSlice';

export const Meteo: React.FC = () => {
  const { user } = useAuthStore();
  const { currentMeteo, loadMeteo, isLoading } = useMeteoStore();
  const [selectedRegion, setSelectedRegion] = useState<string>(user?.region || 'Analamanga');

  const regions = [
    'Analamanga',
    'Vakinankaratra',
    'Itasy',
    'Alaotra-Mangoro',
    'Atsinanana',
    'Analamanjy',
    'Sofia',
    'Betsiboka',
    'Boeny',
    'Melaky',
    'Atsimo-Andrefana',
    'Androy',
    'Anosy',
    'Atsimo-Atsinanana',
    'Vatovavy',
    'Fitovinany',
    'Haute Matsiatra',
    'Amoron\'i Mania',
    'Vatovavy-Fitovinany',
    'Ihorombe',
    'Menabe',
  ];

  useEffect(() => {
    loadMeteo(selectedRegion);
  }, [selectedRegion, loadMeteo]);

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: string } = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      stormy: '⛈️',
      windy: '💨',
    };
    return icons[condition] || '🌤️';
  };

  const getAlerteColor = (niveau?: string) => {
    switch (niveau) {
      case 'rouge':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'jaune':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Météo</h1>
          <p className="text-gray-600">Prévisions météo pour les 3 prochains jours</p>
        </CardHeader>
        <CardBody>
          {/* Sélecteur de région */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <Select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : !currentMeteo ? (
            <div className="text-center py-8 text-gray-500">
              Aucune donnée météo disponible pour cette région
            </div>
          ) : (
            <div className="space-y-4">
              {/* Alertes */}
              {currentMeteo.forecasts.some((f) => f.alerte) && (
                <div className={`p-4 rounded-lg border ${getAlerteColor(
                  currentMeteo.forecasts.find((f) => f.alerte)?.alerte?.niveau
                )}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="font-semibold">Alerte météo</div>
                      <div className="text-sm">
                        {currentMeteo.forecasts.find((f) => f.alerte)?.alerte?.type}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Prévisions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentMeteo.forecasts.slice(0, 3).map((forecast, index) => (
                  <Card key={index} className={index === 0 ? 'ring-2 ring-primary-500' : ''}>
                    <CardBody className="text-center">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        {index === 0 ? 'Aujourd\'hui' : index === 1 ? 'Demain' : `Dans ${index} jours`}
                      </div>
                      <div className="text-4xl mb-2">
                        {getWeatherIcon(forecast.pluieMm > 10 ? 'rainy' : forecast.pluieMm > 0 ? 'cloudy' : 'sunny')}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(forecast.tempMaxC)}°C
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {Math.round(forecast.tempMinC)}°C
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div>💧 {forecast.pluieMm} mm</div>
                        <div>💨 {forecast.ventKmh} km/h</div>
                        <div>💦 {forecast.humiditePercent}%</div>
                      </div>
                      {forecast.alerte && (
                        <div className="mt-2 text-xs font-medium text-red-600">
                          ⚠️ {forecast.alerte.type}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Conseils agricoles */}
              <Card>
                <CardBody>
                  <h3 className="font-semibold mb-2">💡 Conseils agricoles</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {currentMeteo.forecasts[0].pluieMm > 20 && (
                      <li>🌧️ Fortes pluies prévues : protégez vos récoltes et évitez les traitements phytosanitaires</li>
                    )}
                    {currentMeteo.forecasts[0].pluieMm > 0 && currentMeteo.forecasts[0].pluieMm <= 20 && (
                      <li>🌦️ Pluie légère : bon moment pour la plantation si le sol est bien drainé</li>
                    )}
                    {currentMeteo.forecasts[0].pluieMm === 0 && currentMeteo.forecasts[0].tempMaxC > 30 && (
                      <li>☀️ Chaleur : assurez un arrosage suffisant pour vos cultures</li>
                    )}
                    {currentMeteo.forecasts[0].ventKmh > 30 && (
                      <li>💨 Vent fort : sécurisez vos structures et évitez les pulvérisations</li>
                    )}
                    {currentMeteo.forecasts[0].alerte?.niveau === 'rouge' && (
                      <li>🚨 Alert rouge : restez informé et suivez les consignes de sécurité</li>
                    )}
                  </ul>
                </CardBody>
              </Card>

              {/* Info offline */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📱 Dernière mise à jour: {new Date(currentMeteo.updatedAt).toLocaleString('fr-FR')}
                  <br />
                  Les données sont mises à jour automatiquement quand vous êtes connecté.
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
