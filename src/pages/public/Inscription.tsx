import colors from '../../components/common/color';
// pages/public/Inscription.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

const roleOptions = [
  { value: 'agriculteur', label: 'Agriculteur / producteur' },
  { value: 'acheteur', label: 'Acheteur (grossiste, restaurant)' },
  { value: 'transporteur', label: 'Transporteur / livreur' },
  { value: 'agent', label: 'Agent relais' },
];

export const Inscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'acheteur' ? 'acheteur' : 'agriculteur';
  
  const [form, setForm] = useState({
    phone: '',
    name: '',
    role: defaultRole,
    region: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    try {
      await register({
        phone: form.phone,
        name: form.name,
        role: form.role as any,
        region: form.region,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Échec de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: colors.background }}>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center" style={{ color: colors.primary }}>Créer un compte</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              placeholder="034 12 345 67"
              value={form.phone}
              onChange={handleChange}
              required
              icon="📱"
            />
            <Input
              label="Nom complet"
              name="name"
              placeholder="Jean Rakoto"
              value={form.name}
              onChange={handleChange}
              required
              icon="👤"
            />
            <Select
              label="Je suis"
              name="role"
              options={roleOptions}
              value={form.role}
              onChange={handleChange}
              required
            />
            <Input
              label="Région"
              name="region"
              placeholder="Analamanga, Vakinankaratra, ..."
              value={form.region}
              onChange={handleChange}
              required
              icon="🗺️"
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              icon="🔒"
            />
            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              icon="🔒"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-4">
              S'inscrire
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="font-medium" style={{ color: colors.secondary }}>
              Se connecter
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};