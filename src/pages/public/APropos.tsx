import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';

export const APropos: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>
          À propos d’AgriConnect Madagascar
        </h1>

        <Card className="mb-8">
          <CardHeader>Notre mission</CardHeader>
          <CardBody>
            <p className="text-gray-700 leading-relaxed">
              AgriConnect Madagascar est né d’un constat simple : 80% de la population malgache vit de l’agriculture,
              mais les agriculteurs sont isolés, mal informés et perdent jusqu’à 40% de leurs récoltes faute de débouchés.
              Notre plateforme connecte producteurs et acheteurs directement, même dans les zones sans Internet,
              grâce à une application qui fonctionne hors ligne.
            </p>
          </CardBody>
        </Card>

        <Card className="mb-8">
          <CardHeader>Notre équipe</CardHeader>
          <CardBody>
            <p className="text-gray-700 mb-4">
              Une équipe de passionnés de tech et d’agriculture, basée à Madagascar et en France, avec des années d’expérience terrain.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">👨‍🌾</div>
                <div><strong>Rivo Andriantsilavo</strong><br />Co-fondateur, agronome</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">💻</div>
                <div><strong>Miora Rasoanaivo</strong><br />Lead développeur</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Nos valeurs</CardHeader>
          <CardBody>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>🌱 <strong>Inclusion numérique</strong> : l’application fonctionne sans Internet.</li>
              <li>🤝 <strong>Transparence</strong> : prix réels, sans intermédiaire.</li>
              <li>🚜 <strong>Durabilité</strong> : réduire les pertes alimentaires et améliorer les revenus.</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};