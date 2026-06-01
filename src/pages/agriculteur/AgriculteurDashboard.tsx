import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AgriculteurDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Espace Agriculteur</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>🌤️ Météo Locale</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">24°C</p>
            <p className="text-gray-600">Ensoleillé, légères averses prévues demain.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>📈 Prix du marché (Riz)</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-green-600">1 200 Ar / kg</p>
            <p className="text-gray-600">+50 Ar depuis la semaine dernière.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>🚜 Mes Annonces</CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">2 Actives</p>
            <p className="text-gray-600">1 acheteur intéressé.</p>
          </CardBody>
        </Card>
      </div>

      <div className="mb-6">
        <Button variant="primary" size="lg">➕ Publier une nouvelle récolte</Button>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Vos annonces récentes</h2>
      <Card>
        <CardBody>
          <div className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-bold">Maïs doux - 500kg</p>
              <p className="text-sm text-gray-500">Publié hier</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">En ligne</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-bold">Pommes de terre - 1 Tonne</p>
              <p className="text-sm text-gray-500">Publié il y a 3 jours</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Négociation en cours</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
