import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
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

      setSuccessMsg('Un code de réinitialisation a été envoyé par SMS.');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');

      if (!navigator.onLine) {
        setError('Mode hors ligne : impossible d’envoyer le code.');
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
      localStorage.setItem('user', JSON.stringify(data.user));

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/20 shadow-2xl mx-auto text-white"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif mb-2">Mot de passe oublié</h1>
        <p className="text-white/70 text-sm">Réinitialisez votre accès</p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-2">Téléphone enregistré</label>
            <div className="flex items-center bg-black/30 border border-white/20 rounded-lg overflow-hidden focus-within:border-green-400 transition">
              <span className="bg-black/50 px-4 py-3 text-white/70 border-r border-white/20">+261</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="34 12 345 67"
                className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder-white/50 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          <button
            onClick={requestResetOtp}
            disabled={loading}
            className="w-full py-4 mt-2 cursor-pointer border border-green-400 text-green-400 font-bold uppercase text-sm tracking-widest hover:bg-green-400 hover:text-black transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Envoi...' : (
              <>
                <Send size={18} className="mr-2" />
                Envoyer le code
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-2">Code reçu par SMS</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-green-400 transition text-sm text-white placeholder-white/50 text-center tracking-widest"
            />
            <p className="text-xs text-white/50 mt-2 text-center">Valable pendant 10 minutes</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={verifyResetOtp}
            disabled={loading}
            className="w-full py-4 mt-2 cursor-pointer bg-green-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-green-500 transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Vérification...' : (
              <>
                <CheckCircle size={18} className="mr-2" />
                Réinitialiser et connecter
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
            className="w-full cursor-pointer text-sm text-white/50 hover:text-white transition underline text-center"
          >
            ← Changer de numéro
          </button>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/20 space-y-4">
        <div className="text-center">
          <button
            onClick={() => onNavigate ? onNavigate('login') : navigate('/connexion')}
            className="cursor-pointer inline-flex items-center text-white/50 hover:text-white transition text-sm"
          >
            <ArrowLeft size={14} className="mr-2" />
            Retour à la connexion
          </button>
        </div>

        <p className="text-center text-sm text-white/70">
          Pas encore inscrit ?{' '}
          <button
            onClick={() => onNavigate ? onNavigate('register') : navigate('/inscription')}
            className="cursor-pointer text-green-400 font-bold hover:text-green-300 transition"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;