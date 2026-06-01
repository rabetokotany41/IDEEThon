import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import colors from '../../components/common/color'

export const Accueil: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.primary }}>
            AgriConnect Madagascar
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            La première plateforme qui connecte agriculteurs et acheteurs,<br />
            même sans Internet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button variant="primary" size="lg">Je suis agriculteur</Button>
            </Link>
            <Link to="/inscription?role=acheteur">
              <Button variant="secondary" size="lg">Je suis acheteur</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problèmes résolus */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.primary }}>
            Pourquoi AgriConnect ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card hoverable>
              <CardHeader>📉 Prix réels</CardHeader>
              <CardBody>
                Connaissez en temps réel le prix des marchés, même sans connexion.
              </CardBody>
            </Card>
            <Card hoverable>
              <CardHeader>🤝 Vente directe</CardHeader>
              <CardBody>
                Supprimez les intermédiaires et augmentez vos revenus.
              </CardBody>
            </Card>
            <Card hoverable>
              <CardHeader>🌦️ Météo fiable</CardHeader>
              <CardBody>
                Alertes météo locales pour protéger vos récoltes.
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 text-center" style={{ backgroundColor: colors.primary }}>
        <h2 className="text-3xl font-bold text-white mb-4">Prêt à rejoindre la révolution agricole ?</h2>
        <Link to="/inscription">
          <Button variant="secondary" size="lg">S'inscrire gratuitement</Button>
        </Link>
      </section>
    </div>
  );
};