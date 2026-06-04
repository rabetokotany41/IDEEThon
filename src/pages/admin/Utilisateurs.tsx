import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Filter } from 'lucide-react';

const Utilisateurs: React.FC = () => {
  const [filter, setFilter] = useState('Tous');

  const users = [
    { id: 'U-1001', nom: 'Jean Rakoto', role: 'agriculteur', status: 'Actif', inscription: '12 Sep 2023' },
    { id: 'U-1002', nom: 'Supermarché Leader', role: 'acheteur', status: 'Actif', inscription: '15 Sep 2023' },
    { id: 'U-1003', nom: 'Logistique Rapide', role: 'transporteur', status: 'Suspendu', inscription: '20 Sep 2023' },
    { id: 'U-1004', nom: 'Agent Rasoa', role: 'agent', status: 'Actif', inscription: '01 Oct 2023' },
  ];

  const filteredUsers = filter === 'Tous' ? users : users.filter(u => u.role === filter.toLowerCase());

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
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-green-400 transition appearance-none"
          >
            <option value="Tous">Tous les rôles</option>
            <option value="Agriculteur">Agriculteur</option>
            <option value="Acheteur">Acheteur</option>
            <option value="Transporteur">Transporteur</option>
            <option value="Agent">Agent</option>
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4">
                    <p className="font-bold text-white">{user.nom}</p>
                    <p className="text-white/50 text-xs mt-1">{user.id}</p>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-md text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-white/50 text-sm">{user.inscription}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Actif' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Utilisateurs;
