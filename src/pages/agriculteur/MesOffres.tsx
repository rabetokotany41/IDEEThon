import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useOffreStore } from '../../store/slices/offreSlice';
import { useAuthStore } from '../../store/slices/authSlice';
import { OffreStatus } from '../../store/models/offre.model';

export const MesOffres: React.FC = () => {
  const { user } = useAuthStore();
  const { offres, loadOffres, isLoading, updateOffreStatus, deleteOffre } = useOffreStore();

  useEffect(() => {
    if (user) {
      loadOffres(user.id);
    }
  }, [user, loadOffres]);

  const getStatusColor = (status: OffreStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vendue':
        return 'bg-blue-100 text-blue-800';
      case 'expiree':
        return 'bg-gray-100 text-gray-800';
      case 'annulee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: OffreStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'vendue':
        return 'Vendue';
      case 'expiree':
        return 'Expirée';
      case 'annulee':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleMarkAsSold = (offreId: string) => {
    if (confirm('Marquer cette offre comme vendue ?')) {
      updateOffreStatus(offreId, 'vendue');
    }
  };

  const handleDelete = (offreId: string) => {
    if (confirm('Supprimer cette offre ?')) {
      deleteOffre(offreId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes offres</h1>
        <Button variant="primary">
          + Nouvelle offre
        </Button>
      </div>

      {offres.length === 0 ? (
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore d'offres</p>
            <Button variant="primary">Publier ma première offre</Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {offres.map((offre) => (
            <Card key={offre.id} hoverable>
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {offre.product}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offre.status)}`}>
                        {getStatusLabel(offre.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Quantité:</span> {offre.quantityKg} kg
                      </div>
                      <div>
                        <span className="font-medium">Prix:</span> {offre.unitPriceAr} Ar/kg
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {offre.totalPriceAr.toLocaleString()} Ar
                      </div>
                      <div>
                        <span className="font-medium">Lieu:</span> {offre.location.address}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Disponible jusqu'au:</span>{' '}
                        {new Date(offre.availableUntil).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  {offre.images && offre.images.length > 0 && (
                    <div className="ml-4">
                      <img
                        src={offre.images[0]}
                        alt={offre.product}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardBody>
              <CardFooter className="flex justify-end gap-2">
                {offre.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsSold(offre.id)}
                    >
                      Marquer vendue
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(offre.id)}
                    >
                      Supprimer
                    </Button>
                  </>
                )}
                {offre.status === 'expiree' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(offre.id)}
                  >
                    Supprimer
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
