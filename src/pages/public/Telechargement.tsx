import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const Telechargement: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
      <div className="max-w-2xl mx-auto w-full">
        <Card className="shadow-2xl">
          <CardBody className="text-center p-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
              📲
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Installez l'Application AgriConnect
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Profitez d'une expérience plus rapide, d'un accès hors-ligne et recevez des notifications en temps réel pour ne rater aucune opportunité.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button variant="primary" size="lg" fullWidth>
                Installer l'application (PWA)
              </Button>
              <Button variant="outline" size="lg" fullWidth>
                Continuer sur le navigateur
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mt-6">
              * Compatible Android, iOS et PC. Ne prend presque pas d'espace de stockage.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
