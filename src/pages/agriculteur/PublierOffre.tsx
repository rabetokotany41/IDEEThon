import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { UploadPhoto } from '../../components/forms/UploadPhoto';
import { useOffreStore } from '../../store/slices/offreSlice';
import { useAuthStore } from '../../store/slices/authSlice';
import { Offre } from '../../store/models/offre.model';

// Schéma de validation
const offreSchema = z.object({
  product: z.string().min(1, 'Le produit est requis'),
  quantityKg: z.number().min(1, 'La quantité doit être supérieure à 0'),
  unitPriceAr: z.number().min(1, 'Le prix doit être supérieur à 0'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1, 'L\'adresse est requise'),
  }),
  availableUntil: z.string().min(1, 'La date de disponibilité est requise'),
});

type OffreFormData = z.infer<typeof offreSchema>;

export const PublierOffre: React.FC = () => {
  const { user } = useAuthStore();
  const { createOffre, isLoading } = useOffreStore();
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState({ lat: -18.8792, lng: 47.5079, address: '' }); // Antananarivo par défaut

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OffreFormData>({
    resolver: zodResolver(offreSchema),
  });

  const onSubmit = async (data: OffreFormData) => {
    if (!user) return;

    const offreData: Omit<Offre, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      product: data.product,
      quantityKg: data.quantityKg,
      unitPriceAr: data.unitPriceAr,
      totalPriceAr: data.quantityKg * data.unitPriceAr,
      location: data.location,
      availableUntil: new Date(data.availableUntil),
      status: 'active',
      images: images.length > 0 ? images : undefined,
      syncStatus: 'pending',
    };

    try {
      await createOffre(offreData);
      alert('Offre publiée avec succès !');
      // Rediriger vers Mes offres
    } catch (error) {
      alert('Erreur lors de la publication de l\'offre');
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `Position GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        (error) => {
          alert('Impossible d\'obtenir votre position');
        }
      );
    } else {
      alert('Géolocalisation non supportée');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Publier une offre</h1>
          <p className="text-gray-600">Vendez vos produits agricoles directement aux acheteurs</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="space-y-4">
            {/* Produit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produit *
              </label>
              <Select
                {...register('product')}
                error={errors.product?.message}
              >
                <option value="">Sélectionnez un produit</option>
                <option value="riz">Riz</option>
                <option value="mais">Maïs</option>
                <option value="tomate">Tomate</option>
                <option value="oignon">Oignon</option>
                <option value="pomme_de_terre">Pomme de terre</option>
                <option value="carotte">Carotte</option>
                <option value="chou">Chou</option>
                <option value="poivron">Poivron</option>
                <option value="aubergine">Aubergine</option>
                <option value="autre">Autre</option>
              </Select>
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité (kg) *
              </label>
              <Input
                type="number"
                {...register('quantityKg', { valueAsNumber: true })}
                error={errors.quantityKg?.message}
                placeholder="Ex: 100"
              />
            </div>

            {/* Prix unitaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix unitaire (Ar/kg) *
              </label>
              <Input
                type="number"
                {...register('unitPriceAr', { valueAsNumber: true })}
                error={errors.unitPriceAr?.message}
                placeholder="Ex: 2000"
              />
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation *
              </label>
              <div className="flex gap-2">
                <Input
                  {...register('location.address')}
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  error={errors.location?.address?.message}
                  placeholder="Adresse ou utiliser GPS"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeolocation}
                  className="whitespace-nowrap"
                >
                  📍 GPS
                </Button>
              </div>
              <input type="hidden" {...register('location.lat')} value={location.lat} />
              <input type="hidden" {...register('location.lng')} value={location.lng} />
            </div>

            {/* Date de disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponible jusqu'au *
              </label>
              <Input
                type="date"
                {...register('availableUntil')}
                error={errors.availableUntil?.message}
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photos (optionnel)
              </label>
              <UploadPhoto
                onImagesChange={setImages}
                maxImages={3}
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 3 photos. Format JPG, PNG. Taille max 2MB par photo.
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
            >
              Publier l'offre
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
