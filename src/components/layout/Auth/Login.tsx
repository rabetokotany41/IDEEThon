import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import colors from '../../common/color';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demande d'envoi d'OTP
  const requestOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Numéro de téléphone invalide (ex: 0341234567)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Appel API pour envoyer SMS
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error('Erreur envoi OTP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Connexion réseau faible. Réessayez plus tard.');
      // En offline, on peut simuler un code fixe pour le test (à désactiver en prod)
      if (!navigator.onLine) {
        setError('Mode hors ligne : utilisez le code 123456 pour tester');
      }
    } finally {
      setLoading(false);
    }
  };

  // Vérification OTP
  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('Code à 6 chiffres requis');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (!res.ok) throw new Error('Code incorrect');
      const data = await res.json();
      // Stocker token et rôle utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirection selon rôle
      navigate(data.user.role === 'agriculteur' ? '/agriculteur/dashboard' : '/acheteur/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>AgriConnect Madagascar</h1>
          <p className="text-gray-500 mt-1">Connectez-vous avec votre numéro</p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <div className="mt-1 flex items-center border rounded-md overflow-hidden" style={{ borderColor: colors.border }}>
                <span className="bg-gray-100 px-3 py-2 text-gray-600">+261</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="34 12 345 67"
                  className="flex-1 px-3 py-2 outline-none"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Exemple : 341234567</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white font-semibold transition"
              style={{ backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Envoi...' : <><Send size={18} className="mr-2" /> Recevoir le code SMS</>}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code reçu par SMS</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0,6))}
                placeholder="123456"
                className="mt-1 w-full border rounded-md px-3 py-2 outline-none"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white font-semibold"
              style={{ backgroundColor: colors.secondary }}
            >
              {loading ? 'Vérification...' : <><CheckCircle size={18} className="mr-2" /> Se connecter</>}
            </button>

            <button
              onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
              className="w-full text-center text-sm text-gray-500 underline"
            >
              ← Changer de numéro
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          Pas encore inscrit ? <a href="/inscription" className="text-green-700">Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;