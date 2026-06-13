import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Search, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Qualite: React.FC = () => {
  const { user } = useAuth();
  const [controles, setControles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchControles = async () => {
    try {
      const response = await api.get('/quality');
      const formatted = response.data.map((q: any) => ({
        id: `#QC-${q.id.slice(0, 5).toUpperCase()}`,
        produit: q.product_name || `Produit #${q.product_id.slice(0, 5)}`,
        agriculteur: q.farmer_name || 'Agriculteur',
        statut: q.status === 'APPROVED' ? 'Conforme' : q.status === 'REJECTED' ? 'Non conforme' : 'À vérifier',
        date: new Date(q.created_at).toLocaleDateString('fr-FR'),
        agent: q.agent_id === user?.id ? 'Vous' : (q.agent_name || 'Agent inconnu'),
      }));
      setControles(formatted);
    } catch (error) {
      console.error('Error fetching quality reports:', error);
    }
  };

  useEffect(() => {
    fetchControles();
  }, [user]);

  const filtered = controles.filter(c => 
    c.produit.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.agriculteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Contrôle Qualité</h2>
          <p className="text-white/60 mt-1">Inspection des produits avant expédition</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un lot..." 
            className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {filtered.map((ctrl) => (
            <div key={ctrl.id} className="bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  ctrl.statut === 'Conforme' ? 'bg-green-400/20 text-green-400' :
                  ctrl.statut === 'À vérifier' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {ctrl.statut === 'Conforme' ? <CheckCircle size={20} /> :
                   ctrl.statut === 'À vérifier' ? <Clock size={20} /> :
                   <ShieldAlert size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-white">{ctrl.produit}</h3>
                  <p className="text-white/60 text-sm mt-1">{ctrl.agriculteur} • Lot {ctrl.id}</p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  ctrl.statut === 'Conforme' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                  ctrl.statut === 'À vérifier' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                  'bg-red-400/10 text-red-400 border border-red-400/20'
                }`}>
                  {ctrl.statut}
                </span>
                <p className="text-white/40 text-xs mt-2 hidden sm:block">Date: {ctrl.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Qualite;
