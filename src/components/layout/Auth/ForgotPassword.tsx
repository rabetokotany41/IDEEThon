import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import colors from '../../common/color';

const ForgotPassword: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Demander un nouveau code OTP pour réinitialiser
  const requestResetOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Numéro de téléphone invalide (ex: 0341234567)');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Numéro non enregistré');
      setSuccessMsg('Un code de réinitialisation a été envoyé par SMS.');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Erreur réseau. Réessayez plus tard.');
      // Mode offline : simulation pour test
      if (!navigator.onLine) {
        setError('Mode hors ligne : impossible d’envoyer le code. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Vérifier l'OTP et permettre la reconnexion
  const verifyResetOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('Code à 6 chiffres requis');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      if (!res.ok) throw new Error('Code incorrect ou expiré');
      const data = await res.json();
      // Stocker le token (connexion automatique)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Rediriger selon le rôle
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
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>Accès perdu ?</h1>
          <p className="text-gray-500 mt-1">Réinitialisez votre accès avec votre numéro</p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone enregistré</label>
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
              <p className="text-xs text-gray-400 mt-1">Entrez le numéro utilisé lors de l’inscription</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded">
                <CheckCircle size={16} />
                <span className="text-sm">{successMsg}</span>
              </div>
            )}

            <button
              onClick={requestResetOtp}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white font-semibold transition"
              style={{ backgroundColor: colors.secondary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Envoi en cours...' : <><Send size={18} className="mr-2" /> Envoyer le code de réinitialisation</>}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code reçu par SMS</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="123456"
                className="mt-1 w-full border rounded-md px-3 py-2 outline-none"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">Valable 10 minutes</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={verifyResetOtp}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white font-semibold"
              style={{ backgroundColor: colors.success }}
            >
              {loading ? 'Vérification...' : <><CheckCircle size={18} className="mr-2" /> Réinitialiser et me connecter</>}
            </button>

            <button
              onClick={() => { setStep('phone'); setOtp(''); setError(''); setSuccessMsg(''); }}
              className="w-full text-center text-sm text-gray-500 underline"
            >
              ← Changer de numéro
            </button>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/connexion')}
            className="inline-flex items-center text-sm text-green-700 hover:text-green-900"
          >
            <ArrowLeft size={14} className="mr-1" />
            Retour à la connexion
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 border-t pt-4 mt-2">
          Vous n’avez pas de compte ? <a href="/inscription" className="text-green-700">Inscrivez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;