import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Administration - Modération</h1>
      
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-500">Annonces en attente</p>
            <p className="text-3xl font-bold text-yellow-600">24</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-500">Nouveaux utilisateurs</p>
            <p className="text-3xl font-bold text-blue-600">156</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-500">Signalements</p>
            <p className="text-3xl font-bold text-red-600">3</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-500">Transactions / Semaine</p>
            <p className="text-3xl font-bold text-green-600">1,240</p>
          </CardBody>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Alerte Modération</h2>
      <Card className="mb-6 border-l-4 border-red-500">
        <CardBody className="flex justify-between items-center">
          <div>
            <p className="font-bold text-red-700">Prix suspect détecté</p>
            <p className="text-sm text-gray-600">Annonce: "Vanille" à 500 Ar/kg par l'utilisateur 0341234567.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Contacter</Button>
            <Button variant="primary" size="sm" style={{backgroundColor: colors.danger}}>Bloquer</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
