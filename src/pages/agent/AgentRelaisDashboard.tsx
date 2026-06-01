import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';

export const AgentRelaisDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Espace Agent Relais</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>👨‍🌾 Aider un agriculteur sans internet</CardHeader>
          <CardBody>
            <p className="mb-4 text-gray-600">
              Enregistrez les annonces pour les producteurs de votre village via SMS ou depuis cette interface.
            </p>
            <form className="space-y-4">
              <Input label="Numéro de l'agriculteur" placeholder="034 XX XXX XX" icon="📱" />
              <Input label="Produit" placeholder="Ex: Manioc" icon="🌾" />
              <Input label="Quantité" placeholder="Ex: 500 kg" icon="⚖️" />
              <Input label="Prix demandé" placeholder="Ex: 800 Ar/kg" icon="💰" />
              <Button variant="primary" fullWidth>Publier pour l'agriculteur</Button>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>📊 Mes Statistiques</CardHeader>
            <CardBody>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Agriculteurs accompagnés</span>
                <span className="font-bold text-xl text-purple-700">12</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Annonces publiées ce mois</span>
                <span className="font-bold text-xl text-purple-700">45</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Commissions générées</span>
                <span className="font-bold text-xl text-green-600">15 000 Ar</span>
              </div>
            </CardBody>
          </Card>
          
          <Button variant="outline" fullWidth>Voir l'historique des transactions</Button>
        </div>
      </div>
    </div>
  );
};
