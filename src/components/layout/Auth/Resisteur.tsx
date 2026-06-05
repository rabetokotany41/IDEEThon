import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Tractor, ShoppingBag, Truck, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

type Role = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent';

interface RegisterProps {
  onNavigate?: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp' | 'role' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    fullName: '',
    region: '',
    village: '',
    productTypes: [] as string[],
    vehicleType: '',
    organization: '',
  });

  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Numéro invalide');
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
    if (!otp) {
      setError('Code requis');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setStep('role');
      setLoading(false);
    }, 1000);
  };

  const submitProfile = async () => {
    if (!role) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password: otp, // using OTP as initial password 
          role: role.toUpperCase(),
          fullName: profile.fullName || 'Nouvel Utilisateur'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      login(data.user, data.access_token);

      switch (data.user.role) {
        case 'AGRICULTEUR':
          navigate('/agriculteur/dashboard');
          break;
        case 'ACHETEUR':
          navigate('/acheteur/dashboard');
          break;
        case 'TRANSPORTEUR':
          navigate('/transporteur/dashboard');
          break;
        case 'AGENT':
          navigate('/agent/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
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
        <h1 className="text-3xl font-serif mb-2">Créer mon compte</h1>
        <p className="text-white/70 text-sm">Rejoignez AgriConnect</p>
      </div>

      {/* STEP PHONE */}
      {step === "phone" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Numéro de téléphone
            </label>

            <div className="flex items-center bg-black/30 border border-white/20 rounded-lg overflow-hidden focus-within:border-green-400 transition">
              <span className="bg-black/50 px-4 py-3 text-white/70 border-r border-white/20">
                +261
              </span>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder-white/50 text-sm"
                placeholder="34 12 345 67"
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
            className="w-full py-4 cursor-pointer mt-2 border border-green-400 text-green-400 font-bold uppercase text-sm tracking-widest hover:bg-green-400 hover:text-black transition rounded-lg disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer le code"}
          </button>
        </div>
      )}

      {/* STEP OTP */}
      {step === "otp" && (
        <div className="space-y-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            className="w-full bg-black/30 border border-white/20 p-4 rounded-lg text-center tracking-widest focus:border-green-400 transition text-white"
            placeholder="123456"
          />

          {error && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full py-4 cursor-pointer bg-green-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-green-500 transition rounded-lg disabled:opacity-50"
          >
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </div>
      )}

      {/* STEP ROLE */}
      {step === "role" && (
        <div className="space-y-5">
          <p className="text-sm text-white/70">Choisissez votre profil :</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "agriculteur", label: "Agriculteur", icon: Tractor },
              { value: "acheteur", label: "Acheteur", icon: ShoppingBag },
              { value: "transporteur", label: "Transporteur", icon: Truck },
              { value: "agent", label: "Agent", icon: Users },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setRole(r.value as Role);
                  setStep("profile");
                }}
                className="flex cursor-pointer flex-col items-center p-4 bg-black/30 border border-white/20 rounded-xl hover:border-green-400 hover:bg-white/10 transition"
              >
                <r.icon size={26} className="text-green-400 mb-2" />
                <span className="text-sm text-white/90">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP PROFILE */}
      {step === "profile" && role && (
        <div className="space-y-4">
          {/* Nom */}
          <input
            type="text"
            placeholder="Nom complet"
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
            className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:border-green-400 transition text-sm text-white placeholder-white/50"
          />

          {/* REGION SELECT FIXED */}
          <select
            value={profile.region}
            onChange={(e) =>
              setProfile({ ...profile, region: e.target.value })
            }
            className="w-full bg-black/30 border border-white/20 p-4 rounded-lg text-sm text-white focus:border-green-400 transition"
          >
            <option value="" className="bg-gray-800">
              Région
            </option>

            <option value="analamanga">Analamanga</option>
            <option value="vakinankaratra">Vakinankaratra</option>
            <option value="itasy">Itasy</option>
            <option value="bongolava">Bongolava</option>
            <option value="sava">Sava</option>
            <option value="diana">Diana</option>
            <option value="sofia">Sofia</option>
            <option value="boeny">Boeny</option>
            <option value="alaotra_mangoro">Alaotra-Mangoro</option>
            <option value="atsinanana">Atsinanana</option>
            <option value="analanjirofo">Analanjirofo</option>
            <option value="menabe">Menabe</option>
            <option value="melaky">Melaky</option>
            <option value="atsimo_andrefana">Atsimo-Andrefana</option>
            <option value="androy">Androy</option>
            <option value="anosy">Anosy</option>
            <option value="haute_matsiatra">Haute Matsiatra</option>
            <option value="amoron_i_mania">Amoron’i Mania</option>
            <option value="vatovavy">Vatovavy</option>
            <option value="fitovinany">Fitovinany</option>
            <option value="ihorombe">Ihorombe</option>
          </select>

          {/* Village */}
          <input
            type="text"
            placeholder="Village"
            value={profile.village}
            onChange={(e) =>
              setProfile({ ...profile, village: e.target.value })
            }
            className="w-full bg-black/30 border border-white/20 p-4 rounded-lg text-sm text-white placeholder-white/50 focus:border-green-400 transition"
          />

          {/* AGRICULTEUR */}
          {role === "agriculteur" && (
            <input
              type="text"
              placeholder="Cultures (riz, maïs...)"
              value={profile.productTypes.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  productTypes: e.target.value
                    .split(",")
                    .map((s) => s.trim()),
                })
              }
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg text-sm text-white placeholder-white/50 focus:border-green-400 transition"
            />
          )}

          {/* TRANSPORTEUR */}
          {role === "transporteur" && (
            <select
              value={profile.vehicleType}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  vehicleType: e.target.value,
                })
              }
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg text-sm text-white focus:border-green-400 transition"
            >
              <option value="">Type de véhicule</option>
              <option value="charrette">Charrette</option>
              <option value="pick-up">Pick-up</option>
              <option value="camion">Camion</option>
              <option value="moto">Moto</option>
            </select>
          )}

          {/* SUBMIT */}
          <button
            onClick={submitProfile}
            disabled={loading}
            className="w-full py-4 cursor-pointer mt-2 bg-green-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-green-500 transition rounded-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Création..." : "Terminer l'inscription"}
          </button>
        </div>
      )}

      {/* LOGIN LINK */}
      <div className="mt-8 pt-6 border-t border-white/20 text-center">
        <p className="text-sm text-white/70">
          Déjà inscrit ?{" "}
          <button
            onClick={() => onNavigate && onNavigate("login")}
            className="cursor-pointer text-green-400 font-bold hover:text-green-300"
          >
            Se connecter
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;