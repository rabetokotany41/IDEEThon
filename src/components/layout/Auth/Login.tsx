import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

interface LoginProps {
  onNavigate?: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/20 shadow-2xl mx-auto text-white"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif mb-2">AgriConnect</h1>
        <p className="text-white/70 text-sm">Connectez-vous avec votre numéro</p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-2">Téléphone</label>
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

          <button
            onClick={requestOtp}
            disabled={loading}
            className="w-full py-4 mt-2 border border-green-400 text-green-400 font-bold uppercase text-sm tracking-widest hover:bg-green-400 hover:text-black transition-colors rounded-lg disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Recevoir le code SMS'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-2">Code reçu par SMS</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              placeholder="123456"
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-green-400 transition text-sm text-white placeholder-white/50 text-center tracking-widest"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full py-4 mt-2 bg-green-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-green-500 transition-colors rounded-lg disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>

          <button
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
            className="w-full text-sm text-white/50 hover:text-white transition underline text-center"
          >
            ← Changer de numéro
          </button>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/20 space-y-4">
        <p className="text-center text-sm text-white/70">
          Pas encore inscrit ?{' '}
          <button onClick={() => onNavigate && onNavigate('register')} className="text-green-400 hover:text-green-300 font-bold transition">
            Créer un compte
          </button>
        </p>
        <div className="text-center">
          <button onClick={() => onNavigate && onNavigate('forgot-password')} className="text-white/50 hover:text-white text-sm transition">
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;