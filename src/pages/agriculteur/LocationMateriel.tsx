import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { useMaterielStore } from '../../store/slices/materielStore';
import { useAuthStore } from '../../store/slices/authSlice';
import { MaterielStatus } from '../../store/models/materiel.model';

export const LocationMateriel: React.FC = () => {
  const { user } = useAuthStore();
  const { materiel, loadMateriel, isLoading } = useMaterielStore();
  const [filters, setFilters] = useState({
    type: '',
    region: user?.region || '',
  });

  useEffect(() => {
    loadMateriel();
  }, [loadMateriel]);

  const filteredMateriel = materiel.filter((m) => {
    if (filters.type && m.type !== filters.type) return false;
    if (filters.region && !m.localisation.toLowerCase().includes(filters.region.toLowerCase())) return false;
    return m.status === 'disponible';
  });

  const handleContact = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const getStatusColor = (status: MaterielStatus) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'loue':
        return 'bg-blue-100 text-blue-800';
      case 'en_maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: MaterielStatus) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'loue':
        return 'Loué';
      case 'en_maintenance':
        return 'En maintenance';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Location de matériel agricole</h1>
          <p className="text-gray-600">Trouvez du matériel à louer dans votre région</p>
        </CardHeader>
        <CardBody>
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de matériel
              </label>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Tous les types</option>
                <option value="motoculteur">Motoculteur</option>
                <option value="charrue">Charrue</option>
                <option value="pompe">Pompe</option>
                <option value="tracteur">Tracteur</option>
                <option value="roupeuse">Roupeuse</option>
                <option value="moissonneuse">Moissonneuse</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <Input
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                placeholder="Votre région"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredMateriel.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun matériel disponible pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMateriel.map((item) => (
                <Card key={item.id} hoverable>
                  <CardBody>
                    {item.photos && item.photos.length > 0 && (
                      <img
                        src={item.photos[0]}
                        alt={item.type}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    {item.marque && (
                      <p className="text-sm text-gray-600 mb-2">Marque: {item.marque}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Prix:</span> {item.prixParJourAr.toLocaleString()} Ar/jour
                      </div>
                      <div>
                        <span className="font-medium">Localisation:</span> {item.localisation}
                      </div>
                      <div>
                        <span className="font-medium">Disponible du:</span>{' '}
                        {new Date(item.disponibleDu).toLocaleDateString('fr-FR')} au{' '}
                        {new Date(item.disponibleAu).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleContact('+261340000000')}
                    >
                      📞 Contacter le propriétaire
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
