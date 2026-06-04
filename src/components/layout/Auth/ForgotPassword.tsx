import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import colors from '../../common/colors';

const ForgotPassword: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const requestResetOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Numéro de téléphone invalide');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Numéro non enregistré');
      }

      setSuccessMsg(
        'Un code de réinitialisation a été envoyé par SMS.'
      );

      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');

      if (!navigator.onLine) {
        setError(
          'Mode hors ligne : impossible d’envoyer le code.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOtp = async () => {
    if (!otp || otp.length < 6) {
      setError('Code à 6 chiffres requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      if (!res.ok) {
        throw new Error('Code incorrect ou expiré');
      }

      const data = await res.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      navigate(
        data.user.role === 'agriculteur'
          ? '/agriculteur/dashboard'
          : '/acheteur/dashboard'
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ backgroundColor: colors.primaryDark }}
    >
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1
            className="text-3xl font-bold"
            style={{ color: colors.primary }}
          >
            Mot de passe oublié
          </h1>

          <p className="text-gray-500 mt-2">
            Réinitialisez votre accès avec votre numéro
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-1">
                Téléphone enregistré
              </label>

              <div
                className="flex items-center border rounded-lg overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                <span className="bg-gray-100 px-4 py-3">
                  +261
                </span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  placeholder="341234567"
                  className="flex-1 px-4 py-3 bg-transparent outline-none"
                />
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Numéro utilisé lors de l'inscription
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm">
                  {successMsg}
                </span>
              </div>
            )}

            <button
              onClick={requestResetOtp}
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center"
              style={{
                backgroundColor: colors.secondary,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                'Envoi en cours...'
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Envoyer le code
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Code reçu par SMS
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                placeholder="123456"
                className="w-full border rounded-lg px-4 py-3 bg-transparent outline-none"
              />

              <p className="text-xs text-gray-400 mt-1">
                Valable pendant 10 minutes
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={verifyResetOtp}
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center"
              style={{
                backgroundColor: colors.success,
              }}
            >
              {loading ? (
                'Vérification...'
              ) : (
                <>
                  <CheckCircle
                    size={18}
                    className="mr-2"
                  />
                  Réinitialiser et me connecter
                </>
              )}
            </button>

            <button
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
                setSuccessMsg('');
              }}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              ← Changer de numéro
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/connexion')}
            className="inline-flex items-center text-green-700 hover:underline"
          >
            <ArrowLeft size={14} className="mr-1" />
            Retour à la connexion
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-sm text-gray-500">
            Vous n'avez pas encore de compte ?
          </p>

          <Link
            to="/inscription"
            className="text-green-700 font-medium hover:underline"
          >
            Inscrivez-vous
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;