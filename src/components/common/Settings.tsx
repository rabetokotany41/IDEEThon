import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Bell, Trash2, Save, Camera, Eye, EyeOff,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../store/services/api';
import Swal from 'sweetalert2';

interface UserProfile {
  full_name: string;
  phone: string;
  region: string;
  village: string;
  avatar_url?: string;
}

interface NotifPrefs {
  email_notifications: boolean;
  sms_notifications: boolean;
  notify_orders: boolean;
  notify_delivery: boolean;
  notify_loans: boolean;
  notify_quality: boolean;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'danger'>('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profil
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    region: '',
    village: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Préférences notifications
  const [prefs, setPrefs] = useState<NotifPrefs>({
    email_notifications: true,
    sms_notifications: false,
    notify_orders: true,
    notify_delivery: true,
    notify_loans: true,
    notify_quality: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user?.fullName || '',
        phone: user.phone || '',
        region: user?.region || '',
        village: user?.village || '',
        avatar_url: user?.avatarUrl || user?.avatar_url,
      });
    }
    fetchNotificationPrefs();
  }, [user]);

  const fetchNotificationPrefs = async () => {
    try {
      const res = await api.get('/users/notification-preferences');
      setPrefs(res.data);
    } catch (error) {
      console.error('Erreur chargement préférences', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name);
      formData.append('region', profile.region);
      formData.append('village', profile.village);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data.user);
      Swal.fire('Succès', 'Profil mis à jour', 'success');
      setAvatarFile(null);
    } catch (error: any) {
      Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire('Erreur', 'Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      Swal.fire('Succès', 'Mot de passe modifié', 'success');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      Swal.fire('Erreur', error.response?.data?.message || 'Mot de passe actuel incorrect', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefsUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/users/notification-preferences', prefs);
      Swal.fire('Succès', 'Préférences enregistrées', 'success');
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de sauvegarder', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Supprimer le compte ?',
      text: 'Cette action est irréversible. Toutes vos données seront effacées.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await api.delete('/users/account');
        logout();
        Swal.fire('Supprimé', 'Votre compte a été supprimé', 'success');
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de supprimer le compte', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <User className="w-8 h-8 text-green-400" />
        Paramètres
      </h1>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 mb-8">
        {[
          { id: 'profile', label: 'Profil', icon: User },
          { id: 'password', label: 'Mot de passe', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'danger', label: 'Suppression', icon: Trash2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2 rounded-t-xl transition-all ${
              activeTab === tab.id
                ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formulaire Profil */}
      {activeTab === 'profile' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleProfileUpdate}
          className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition">
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-sm">Téléphone (non modifiable)</p>
              <p className="text-white font-mono">{profile.phone}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-1">Nom complet</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Région</label>
              <input
                type="text"
                value={profile.region}
                onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Village</label>
              <input
                type="text"
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : <><Save size={18} /> Enregistrer</>}
          </button>
        </motion.form>
      )}

      {/* Changement mot de passe */}
      {activeTab === 'password' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePasswordChange}
          className="space-y-4 bg-white/5 rounded-2xl p-6 border border-white/10 max-w-md"
        >
          <div>
            <label className="block text-white/70 text-sm mb-1">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full px-4 py-2 pr-10 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
                required
              />
              <button type="button" className="absolute right-3 top-2.5 text-white/50" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition"
          >
            {loading ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </motion.form>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6"
        >
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Moyens de réception</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.email_notifications} onChange={(e) => setPrefs({ ...prefs, email_notifications: e.target.checked })} className="w-4 h-4" />
              <span className="text-white/80">Notifications par email</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.sms_notifications} onChange={(e) => setPrefs({ ...prefs, sms_notifications: e.target.checked })} className="w-4 h-4" />
              <span className="text-white/80">Notifications par SMS</span>
            </label>
          </div>
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Types d'alertes</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.notify_orders} onChange={(e) => setPrefs({ ...prefs, notify_orders: e.target.checked })} />
              <span className="text-white/80">Commandes</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.notify_delivery} onChange={(e) => setPrefs({ ...prefs, notify_delivery: e.target.checked })} />
              <span className="text-white/80">Livraisons</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.notify_loans} onChange={(e) => setPrefs({ ...prefs, notify_loans: e.target.checked })} />
              <span className="text-white/80">Microcrédits</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prefs.notify_quality} onChange={(e) => setPrefs({ ...prefs, notify_quality: e.target.checked })} />
              <span className="text-white/80">Contrôle qualité</span>
            </label>
          </div>
          <button
            onClick={handlePrefsUpdate}
            disabled={loading}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </button>
        </motion.div>
      )}

      {/* Zone dangereuse - suppression compte */}
      {activeTab === 'danger' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Supprimer le compte</h2>
          </div>
          <p className="text-white/70 mb-6">
            La suppression est définitive. Toutes vos données (produits, commandes, prêts, etc.) seront effacées.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium transition"
          >
            {loading ? 'Suppression...' : 'Supprimer mon compte'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;