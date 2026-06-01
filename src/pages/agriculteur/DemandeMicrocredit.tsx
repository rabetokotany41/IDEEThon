import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { UploadPhoto } from '../../components/forms/UploadPhoto';
import { useMicrocreditStore } from '../../store/slices/microcreditSlice';
import { useAuthStore } from '../../store/slices/authSlice';

const creditSchema = z.object({
  montantDemandeAr: z.number().min(50000, 'Le montant minimum est de 50 000 Ar'),
  dureeMois: z.number().min(3, 'Durée minimum: 3 mois').max(24, 'Durée maximum: 24 mois'),
  raison: z.string().min(10, 'Décrivez votre projet en au moins 10 caractères'),
});

type CreditFormData = z.infer<typeof creditSchema>;

export const DemandeMicrocredit: React.FC = () => {
  const { user } = useAuthStore();
  const { createCredit, isLoading } = useMicrocreditStore();
  const [justificatif, setJustificatif] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditFormData>({
    resolver: zodResolver(creditSchema),
  });

  const onSubmit = async (data: CreditFormData) => {
    if (!user) return;

    try {
      await createCredit({
        userId: user.id,
        montantDemandeAr: data.montantDemandeAr,
        dureeMois: data.dureeMois,
        raison: data.raison,
        justificatifUrl: justificatif || undefined,
        statut: 'demande',
        syncStatus: 'pending',
      });
      alert('Demande de microcrédit envoyée avec succès !');
      // Reset form or redirect
    } catch (error) {
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  const calculateMonthlyPayment = (montant: number, duree: number) => {
    // Taux d'intérêt estimé: 2% par mois
    const taux = 0.02;
    const mensualite = (montant * taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
    return Math.round(mensualite);
  };

  const calculateTotal = (montant: number, duree: number) => {
    const mensualite = calculateMonthlyPayment(montant, duree);
    return mensualite * duree;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Demande de microcrédit</h1>
          <p className="text-gray-600">Financez vos projets agricoles</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="space-y-4">
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant demandé (Ar) *
              </label>
              <Input
                type="number"
                {...register('montantDemandeAr', { valueAsNumber: true })}
                error={errors.montantDemandeAr?.message}
                placeholder="Ex: 500000"
                min={50000}
                max={5000000}
              />
              <p className="text-xs text-gray-500 mt-1">
                Montant minimum: 50 000 Ar, maximum: 5 000 000 Ar
              </p>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée du remboursement (mois) *
              </label>
              <Select
                {...register('dureeMois', { valueAsNumber: true })}
                error={errors.dureeMois?.message}
              >
                <option value="">Sélectionnez la durée</option>
                <option value="3">3 mois</option>
                <option value="6">6 mois</option>
                <option value="12">12 mois</option>
                <option value="18">18 mois</option>
                <option value="24">24 mois</option>
              </Select>
            </div>

            {/* Raison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raison du prêt *
              </label>
              <textarea
                {...register('raison')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Décrivez votre projet et l'utilisation prévue des fonds..."
                error={errors.raison?.message}
              />
              {errors.raison && (
                <p className="text-sm text-red-600 mt-1">{errors.raison.message}</p>
              )}
            </div>

            {/* Justificatif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Justificatif (optionnel)
              </label>
              <UploadPhoto
                onImagesChange={(images) => setJustificatif(images[0] || '')}
                maxImages={1}
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Photo de votre parcelle, récolte, ou document justificatif
              </p>
            </div>

            {/* Simulation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📊 Simulation</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>Taux d'intérêt estimé: 2% / mois</div>
                <div>Mensualité estimée: {
                  calculateMonthlyPayment(
                    Number(register('montantDemandeAr').value) || 0,
                    Number(register('dureeMois').value) || 0
                  ).toLocaleString()
                } Ar</div>
                <div>Total à rembourser: {
                  calculateTotal(
                    Number(register('montantDemandeAr').value) || 0,
                    Number(register('dureeMois').value) || 0
                  ).toLocaleString()
                } Ar</div>
              </div>
            </div>

            {/* Informations */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Informations importantes</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Le délai de traitement est de 5 à 10 jours ouvrés</li>
                <li>• Un agent vous contactera pour valider votre dossier</li>
                <li>• Le remboursement se fait via mobile money (Orange Money / Airtel Money)</li>
                <li>• En cas de retard, des pénalités peuvent s'appliquer</li>
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
            >
              Envoyer la demande
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
