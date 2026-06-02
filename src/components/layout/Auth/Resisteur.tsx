import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, MapPin, Tractor, ShoppingBag, Truck, Users, CheckCircle } from 'lucide-react';
import colors from '../../common/color';

type Role = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent';

const Register: React.FC = () => {
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
    productTypes: [] as string[], // pour agriculteur
    vehicleType: '', // transporteur
    organization: '', // acheteur / agent
  });
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!phone || phone.length < 9) return setError('Numéro invalide');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.exists) throw new Error('Ce numéro est déjà utilisé. Connectez-vous.');
      await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }), headers: { 'Content-Type': 'application/json' } });
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError('Code requis');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }), headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error('Code incorrect');
      setStep('role');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitProfile = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ phone, role, ...profile }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/connexion');
    } catch (err: any) {
      setError("Erreur d'inscription. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center" style={{ color: colors.primary }}>Créer mon compte</h1>

        {step === 'phone' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Numéro de téléphone</label>
              <div className="flex mt-1 border rounded-md">
                <span className="bg-gray-100 px-3 py-2">+261</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 outline-none" placeholder="341234567" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={requestOtp} className="w-full py-2 rounded-md text-white" style={{ backgroundColor: colors.primary }}>Envoyer le code</button>
          </div>
        )}

        {step === 'otp' && (
          <div className="mt-6 space-y-4">
            <label>Code reçu par SMS</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.slice(0,6))} className="w-full border rounded-md px-3 py-2" placeholder="123456" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={verifyOtp} className="w-full py-2 rounded-md text-white" style={{ backgroundColor: colors.secondary }}>Vérifier</button>
          </div>
        )}

        {step === 'role' && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">Choisissez votre profil :</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'agriculteur', label: 'Agriculteur', icon: Tractor },
                { value: 'acheteur', label: 'Acheteur', icon: ShoppingBag },
                { value: 'transporteur', label: 'Transporteur', icon: Truck },
                { value: 'agent', label: 'Agent relais', icon: Users },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value as Role); setStep('profile'); }}
                  className="flex flex-col items-center p-3 border rounded-lg hover:bg-green-50 transition"
                >
                  <r.icon size={28} style={{ color: colors.primary }} />
                  <span className="mt-1 text-sm">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'profile' && role && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Complétez votre profil</h2>
            <div>
              <label>Nom complet</label>
              <input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label>Région / District</label>
              <input type="text" value={profile.region} onChange={(e) => setProfile({...profile, region: e.target.value})} className="w-full border rounded-md px-3 py-2" placeholder="Ex: Vakinankaratra" />
            </div>
            <div>
              <label>Village / Fokontany</label>
              <input type="text" value={profile.village} onChange={(e) => setProfile({...profile, village: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>

            {role === 'agriculteur' && (
              <div>
                <label>Principales cultures</label>
                <input type="text" placeholder="maïs, riz, haricot..." value={profile.productTypes.join(', ')} onChange={(e) => setProfile({...profile, productTypes: e.target.value.split(',').map(s=>s.trim())})} className="w-full border rounded-md px-3 py-2" />
              </div>
            )}
            {role === 'transporteur' && (
              <div>
                <label>Type de véhicule</label>
                <select value={profile.vehicleType} onChange={(e) => setProfile({...profile, vehicleType: e.target.value})} className="w-full border rounded-md p-2">
                  <option value="">-- Choisir --</option>
                  <option>Charrette</option><option>Pick-up</option><option>Camion</option><option>Moto</option>
                </select>
              </div>
            )}

            <button onClick={submitProfile} disabled={loading} className="w-full py-2 rounded-md text-white flex items-center justify-center" style={{ backgroundColor: colors.success }}>
              {loading ? 'Inscription...' : <><CheckCircle size={18} className="mr-2" /> Terminer</>}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;