import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import colors from '../../common/colors';
import { useAuth } from '../../../hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Numéro de téléphone invalide (ex: 0341234567)');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('Code à 6 chiffres requis');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      login(phone, 'agriculteur');
      navigate('/agriculteur/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent"
      style={{ backgroundColor: colors.primaryDark }}>
      <div className="max-w-md w-full backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
            AgriConnect Madagascar
          </h1>
          <p className="text-gray-500 mt-1">
            Connectez-vous avec votre numéro
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white">Téléphone</label>

              <div
                className="mt-1 flex items-center border rounded-md overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                <span className="bg-gray-100 px-3 py-2 text-gray-600">
                  +261
                </span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="34 12 345 67"
                  className="flex-1 px-3 py-2 outline-none bg-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full py-3 rounded-md text-white font-semibold"
              style={{
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Envoi...' : 'Recevoir le code SMS'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              placeholder="123456"
              className="w-full border rounded-md px-3 py-2 bg-transparent outline-none"
            />

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full py-3 rounded-md text-white font-semibold"
              style={{ backgroundColor: colors.secondary }}
            >
              {loading ? 'Vérification...' : 'Se connecter'}
            </button>

            <button
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="w-full text-sm text-gray-500 underline"
            >
              ← Changer de numéro
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          Pas encore inscrit ?{' '}
          <a href="/inscription" className="text-green-700">
            Créer un compte
          </a>
        </p>
        <div>
          <p>
            <a href="/forgot-password" className="text-green-700 text-sm">
              Mot de passe oublié ?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;