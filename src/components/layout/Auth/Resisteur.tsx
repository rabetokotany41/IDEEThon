import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Tractor, ShoppingBag, Truck, Users } from 'lucide-react';
import colors from '../../common/colors';
import { useAuth } from '../../../hooks/useAuth';

type Role = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent';

const Register: React.FC = () => {
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

    setTimeout(() => {
      login(phone, role as any);

      switch (role) {
        case 'agriculteur':
          navigate('/agriculteur/dashboard');
          break;
        case 'acheteur':
          navigate('/acheteur/recherche');
          break;
        case 'agent':
          navigate('/agent/agriculteurs');
          break;
        default:
          navigate('/');
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-transparent"
          style={{ backgroundColor: colors.primaryDark }}>
      <div className="max-w-md w-full backdrop-blur-sm rounded-xl shadow-md p-6 space-y-6">

        <h1
          className="text-2xl font-bold text-center"
          style={{ color: colors.primary }}
        >
          Créer mon compte
        </h1>

        {/* STEP PHONE */}
        {step === 'phone' && (
          <div className="space-y-4">
            <label className="text-sm">Numéro de téléphone</label>

            <div className="flex border rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2">+261</span>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ''))
                }
                className="flex-1 px-3 py-2 outline-none bg-transparent"
                placeholder="341234567"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={requestOtp}
              className="w-full py-2 rounded-md text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Envoyer le code
            </button>
          </div>
        )}

        {/* STEP OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <label>Code reçu par SMS</label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              className="w-full border rounded-md px-3 py-2 bg-transparent"
              placeholder="123456"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={verifyOtp}
              className="w-full py-2 rounded-md text-white"
              style={{ backgroundColor: colors.secondary }}
            >
              Vérifier
            </button>
          </div>
        )}

        {/* STEP ROLE */}
        {step === 'role' && (
          <div className="space-y-4">
            <p>Choisissez votre profil :</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'agriculteur', label: 'Agriculteur', icon: Tractor },
                { value: 'acheteur', label: 'Acheteur', icon: ShoppingBag },
                { value: 'transporteur', label: 'Transporteur', icon: Truck },
                { value: 'agent', label: 'Agent', icon: Users },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setRole(r.value as Role);
                    setStep('profile');
                  }}
                  className="flex flex-col items-center p-3 border rounded-lg hover:bg-green-50"
                >
                  <r.icon size={26} style={{ color: colors.primary }} />
                  <span className="text-sm">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP PROFILE */}
        {step === 'profile' && role && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Profil</h2>

            <input
              type="text"
              placeholder="Nom complet"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 bg-transparent"
            />

            <input
              type="text"
              placeholder="Région"
              value={profile.region}
              onChange={(e) =>
                setProfile({ ...profile, region: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 bg-transparent"
            />

            <input
              type="text"
              placeholder="Village"
              value={profile.village}
              onChange={(e) =>
                setProfile({ ...profile, village: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 bg-transparent"
            />

            {role === 'agriculteur' && (
              <input
                type="text"
                placeholder="Cultures (riz, maïs...)"
                value={profile.productTypes.join(', ')}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    productTypes: e.target.value
                      .split(',')
                      .map((s) => s.trim()),
                  })
                }
                className="w-full border rounded-md px-3 py-2 bg-transparent"
              />
            )}

            {role === 'transporteur' && (
              <select
                value={profile.vehicleType}
                onChange={(e) =>
                  setProfile({ ...profile, vehicleType: e.target.value })
                }
                className="w-full border rounded-md p-2 bg-transparent"
              >
                <option value="">Type de véhicule</option>
                <option>Charrette</option>
                <option>Pick-up</option>
                <option>Camion</option>
                <option>Moto</option>
              </select>
            )}

            <button
              onClick={submitProfile}
              disabled={loading}
              className="w-full py-2 rounded-md text-white flex items-center justify-center"
              style={{ backgroundColor: colors.success }}
            >
              {loading ? 'Inscription...' : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Terminer
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;