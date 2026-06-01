import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';

export const AcheteurDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.secondary }}>Espace Acheteur</h1>
      
      <div className="mb-8 flex gap-4">
        <div className="flex-1">
          <Input placeholder="Rechercher un produit (ex: Riz, Vanille, Maïs...)" icon="🔍" />
        </div>
        <Button variant="secondary">Rechercher</Button>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Dernières offres directes producteurs</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hoverable>
          <CardHeader>Oignons rouges - 200kg</CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 mb-2">📍 Vakinankaratra - Antsirabe</p>
            <p className="text-xl font-bold text-green-600 mb-4">800 Ar / kg</p>
            <Button variant="primary" fullWidth>Contacter l'agriculteur</Button>
          </CardBody>
        </Card>
        <Card hoverable>
          <CardHeader>Vanille Bourbon - 10kg</CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 mb-2">📍 Sava - Sambava</p>
            <p className="text-xl font-bold text-green-600 mb-4">120 000 Ar / kg</p>
            <Button variant="primary" fullWidth>Contacter l'agriculteur</Button>
          </CardBody>
        </Card>
        <Card hoverable>
          <CardHeader>Haricots blancs - 500kg</CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 mb-2">📍 Haute Matsiatra - Fianarantsoa</p>
            <p className="text-xl font-bold text-green-600 mb-4">1 500 Ar / kg</p>
            <Button variant="primary" fullWidth>Contacter l'agriculteur</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
