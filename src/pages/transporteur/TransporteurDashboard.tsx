import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const TransporteurDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Espace Transporteur</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>🛣️ État des Routes (Temps Réel)</CardHeader>
          <CardBody>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>RN7 - Antananarivo - Antsirabe</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Praticable</span>
              </li>
              <li className="flex justify-between items-center">
                <span>RN2 - Moramanga - Toamasina</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Travaux / Ralentissements</span>
              </li>
              <li className="flex justify-between items-center">
                <span>RN4 - Maevatanana</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Coupée (Pluies)</span>
              </li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>📦 Opportunités de Livraison</CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="border p-3 rounded-lg">
                <p className="font-bold">Antsirabe ➡️ Antananarivo</p>
                <p className="text-sm text-gray-600">2 Tonnes de Pommes de terre - Prêt demain</p>
                <Button variant="primary" size="sm" className="mt-2">Proposer mon camion</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
