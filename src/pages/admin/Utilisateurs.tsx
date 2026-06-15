import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

// Types correspondant à la table users
interface User {
  id: string;
  phone: string;
  full_name: string | null;
  role: 'AGRICULTEUR' | 'ACHETEUR' | 'TRANSPORTEUR' | 'AGENT' | 'ADMIN';
  region: string | null;
  village: string | null;
  is_verified: boolean;
  created_at: string;
}

interface FormattedUser {
  id: string;
  fullId: string;
  nom: string;
  role: string;
  roleKey: User['role'];
  status: string;
  inscription: string;
}

const roleLabels: Record<User['role'], string> = {
  AGRICULTEUR: 'Agriculteur',
  ACHETEUR: 'Acheteur',
  TRANSPORTEUR: 'Transporteur',
  AGENT: 'Agent',
  ADMIN: 'Admin',
};

const Utilisateurs: React.FC = () => {
  const [filter, setFilter] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<FormattedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<User[]>('/users');
      const formatted = response.data.map((u) => ({
        id: u.id,
        fullId: u.id,
        nom: u.full_name || u.phone,
        role: roleLabels[u.role] || u.role.toLowerCase(),
        roleKey: u.role,
        status: u.is_verified ? 'Actif' : 'En attente',
        inscription: new Date(u.created_at).toLocaleDateString('fr-FR'),
      }));
      setUsers(formatted);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError('Impossible de charger la liste des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`Supprimer définitivement l'utilisateur "${userName}" ? Cette action est irréversible.`)) {
      return;
    }
    setDeletingId(userId);
    try {
      await api.delete(`/users/${userId}`);
      // Rafraîchir la liste
      await fetchUsers();
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert("Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (userId: string) => {
    // Pour l'instant, rediriger vers une page d'édition ou ouvrir un modal
    // Exemple : navigate(`/admin/users/${userId}/edit`)
    alert(`Fonction d'édition à implémenter pour l'utilisateur ${userId}`);
  };

  // Filtrage par rôle et recherche
  const filteredUsers = users.filter((user) => {
    const matchesRole = filter === 'Tous' || user.roleKey === filter;
    const matchesSearch =
      searchTerm === '' ||
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Options pour le filtre de rôle (basé sur les valeurs réelles de l'enum)
  const roleOptions = [
    { value: 'Tous', label: 'Tous les rôles' },
    { value: 'AGRICULTEUR', label: 'Agriculteur' },
    { value: 'ACHETEUR', label: 'Acheteur' },
    { value: 'TRANSPORTEUR', label: 'Transporteur' },
    { value: 'AGENT', label: 'Agent' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Gestion des Utilisateurs</h2>
          <p className="text-white/60 mt-1">Gérez tous les comptes de la plateforme</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Rechercher (nom, ID, rôle)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-green-400 transition"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">ID & Nom</th>
                <th className="p-4 font-medium">Rôle</th>
                <th className="p-4 font-medium">Inscription</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">
                    <Loader2 className="animate-spin inline-block mr-2" size={20} />
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-400">
                    <AlertCircle size={20} className="inline-block mr-2" />
                    {error}
                    <button onClick={fetchUsers} className="ml-3 underline">
                      Réessayer
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">
                    Aucun utilisateur ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4">
                      <p className="font-bold text-white">{user.nom}</p>
                      <p className="text-white/50 text-xs mt-1 font-mono">{user.fullId.slice(0, 8)}...</p>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-md text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-sm">{user.inscription}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Actif'
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-yellow-400/20 text-yellow-400'
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.nom)}
                        disabled={deletingId === user.id}
                        className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingId === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Utilisateurs;