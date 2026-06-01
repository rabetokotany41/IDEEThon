import colors from '../../components/common/color';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { useAuth, demoUsers, type UserRole } from '../../hooks/useAuth';

export const Connexion: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Liste des rôles pour le sélecteur
  const roleOptions = [
    { value: '', label: '-- Choisir un compte de démonstration --' },
    { value: 'agriculteur', label: '🧑‍🌾 Agriculteur' },
    { value: 'acheteur', label: '🛒 Acheteur' },
    { value: 'transporteur', label: '🚚 Transporteur' },
    { value: 'agent', label: '🤝 Agent relais' },
    { value: 'admin', label: '🔧 Administrateur' },
    { value: 'superadmin', label: '⚙️ Super Admin' },
  ];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole | '';
    if (role && demoUsers[role]) {
      setPhone(demoUsers[role].phone);
      setPassword(demoUsers[role].password);
    } else {
      setPhone('');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Échec de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center" style={{ color: colors.primary }}>Connexion</h2>
        </CardHeader>
        <CardBody>
          {/* Sélecteur de démo – visible seulement en développement */}
          {import.meta.env.DEV && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Select
                label="🔐 Compte de test (démo)"
                options={roleOptions}
                onChange={handleRoleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Sélectionnez un rôle pour pré-remplir les identifiants</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Téléphone"
              type="tel"
              placeholder="034 12 345 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              icon="📱"
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon="🔒"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-4">
              Se connecter
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium" style={{ color: colors.secondary }}>
              Créer un compte
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};