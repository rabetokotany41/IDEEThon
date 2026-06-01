import colors from '../../components/common/color';
import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';

export const MentionsLegales: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>
          Mentions Légales & Politique de Confidentialité
        </h1>

        <Card className="mb-8">
          <CardHeader>1. Mentions Légales</CardHeader>
          <CardBody>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Éditeur de la plateforme :</strong> AgriConnect Madagascar<br />
              <strong>Siège social :</strong> Antananarivo, Madagascar<br />
              <strong>Contact :</strong> contact@agriconnect.mg
            </p>
            <p className="text-gray-700 leading-relaxed">
              La plateforme AgriConnect a pour objectif de mettre en relation les acteurs du secteur agricole à Madagascar. 
              Elle est fournie en l'état et l'éditeur ne saurait être tenu responsable des transactions effectuées entre les utilisateurs.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>2. Politique de Confidentialité</CardHeader>
          <CardBody>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chez AgriConnect, nous prenons votre vie privée au sérieux. Les informations que vous fournissez (numéro de téléphone, localisation, nom) 
              sont utilisées uniquement dans le but de faciliter les mises en relation professionnelles sur la plateforme.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Vos données ne sont jamais vendues à des tiers.</li>
              <li>Vous pouvez à tout moment demander la suppression de votre compte et de vos données.</li>
              <li>Certaines données (comme les prix du marché) sont anonymisées pour générer des statistiques globales.</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
