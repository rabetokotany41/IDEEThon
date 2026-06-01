import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const Aide: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>
          Centre d'Aide & Tutoriels
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Apprenez à utiliser AgriConnect, même sans connexion Internet.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>🎥 Comment publier une récolte ?</CardHeader>
            <CardBody>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">▶️</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Tutoriel vidéo de 2 minutes pour les agriculteurs.</p>
              <Button variant="secondary" fullWidth>Voir la vidéo</Button>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>📡 Mode d'emploi Offline</CardHeader>
            <CardBody>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Découvrez comment utiliser l'application via SMS / USSD sans internet.</p>
              <Button variant="secondary" fullWidth>Lire le guide</Button>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>Foire aux questions (FAQ)</CardHeader>
          <CardBody className="space-y-4">
            <details className="p-4 border rounded-lg bg-gray-50 cursor-pointer">
              <summary className="font-semibold text-gray-800">L'application est-elle gratuite ?</summary>
              <p className="mt-2 text-gray-600 text-sm">Oui, la création de compte et la consultation des annonces sont totalement gratuites pour tous les utilisateurs.</p>
            </details>
            <details className="p-4 border rounded-lg bg-gray-50 cursor-pointer">
              <summary className="font-semibold text-gray-800">Comment devenir Agent Relais ?</summary>
              <p className="mt-2 text-gray-600 text-sm">Vous devez vous inscrire en tant qu'Agent Relais et passer une courte formation certifiante en ligne ou avec notre équipe.</p>
            </details>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
