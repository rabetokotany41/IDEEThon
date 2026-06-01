import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { UploadPhoto } from '../../components/forms/UploadPhoto';
import { useAuthStore } from '../../store/slices/authSlice';

export const MonProfil: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const [avatar, setAvatar] = useState<string>(user?.avatarUrl || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      region: user?.region || '',
      village: user?.village || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (data: any) => {
    updateUser({
      ...data,
      avatarUrl: avatar || undefined,
    });
    alert('Profil mis à jour avec succès !');
  };

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👨‍🌾</span>
                  )}
                </div>
                <UploadPhoto
                  onImagesChange={(images) => setAvatar(images[0] || '')}
                  maxImages={1}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <Input
                {...register('name')}
                error={errors.name?.message as string}
                placeholder="Votre nom"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <Input
                {...register('phone')}
                error={errors.phone?.message as string}
                placeholder="+261 34 00 000 00"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Le téléphone ne peut pas être modifié
              </p>
            </div>

            {/* Région */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <Select {...register('region')} error={errors.region?.message as string}>
                <option value="">Sélectionnez votre région</option>
                <option value="Analamanga">Analamanga</option>
                <option value="Vakinankaratra">Vakinankaratra</option>
                <option value="Itasy">Itasy</option>
                <option value="Alaotra-Mangoro">Alaotra-Mangoro</option>
                <option value="Atsinanana">Atsinanana</option>
                <option value="Analamanjy">Analamanjy</option>
                <option value="Sofia">Sofia</option>
                <option value="Betsiboka">Betsiboka</option>
                <option value="Boeny">Boeny</option>
                <option value="Melaky">Melaky</option>
                <option value="Atsimo-Andrefana">Atsimo-Andrefana</option>
                <option value="Androy">Androy</option>
                <option value="Anosy">Anosy</option>
                <option value="Atsimo-Atsinanana">Atsimo-Atsinanana</option>
                <option value="Vatovavy">Vatovavy</option>
                <option value="Fitovinany">Fitovinany</option>
                <option value="Haute Matsiatra">Haute Matsiatra</option>
                <option value="Amoron'i Mania">Amoron'i Mania</option>
                <option value="Vatovavy-Fitovinany">Vatovavy-Fitovinany</option>
                <option value="Ihorombe">Ihorombe</option>
                <option value="Menabe">Menabe</option>
              </Select>
            </div>

            {/* Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Village / Commune
              </label>
              <Input
                {...register('village')}
                error={errors.village?.message as string}
                placeholder="Votre village"
              />
            </div>

            {/* Préférences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Préférences</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Langue</span>
                <Select className="w-32" defaultValue={user?.preferences?.language || 'fr'}>
                  <option value="fr">Français</option>
                  <option value="mg">Malgache</option>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Notifications</span>
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences?.notificationsEnabled}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Mode économie de données</span>
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences?.lowDataMode}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Info compte */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Informations du compte</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Rôle: {user?.role}</div>
                <div>Membre depuis: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</div>
                <div>Dernière connexion: {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('fr-FR') : 'N/A'}</div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="space-y-2">
            <Button type="submit" fullWidth>
              Enregistrer les modifications
            </Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>
              Se déconnecter
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
