import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Activity, TrendingUp } from 'lucide-react';
import api from '../../services/api';

// Types pour les stats
interface DashboardStats {
  totalUsers: number;
  usersByRole: {
    AGRICULTEUR: number;
    ACHETEUR: number;
    TRANSPORTEUR: number;
    AGENT: number;
    ADMIN: number;
  };
  monthlySales: Array<{ month: string; total: number }>;
  topProduct: { name: string; demand: number };
  topRegion: { region: string; percentage: number };
  avgDeliveryDays: number;
}

const Statistiques: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<DashboardStats>('/users/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center text-red-400 py-20">
        <p>{error || "Données non disponibles"}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-orange-400">Réessayer</button>
      </div>
    );
  }

  // Préparer les données pour le graphique des ventes mensuelles
  const monthlyTotals = stats.monthlySales.map(m => m.total);
  const maxSale = Math.max(...monthlyTotals, 1);
  const months = stats.monthlySales.map(m => m.month.slice(0, 1)); // première lettre

  // Répartition par rôle pour le pie chart (simplifié)
  const totalUsers = stats.totalUsers;
  const farmers = stats.usersByRole.AGRICULTEUR;
  const buyers = stats.usersByRole.ACHETEUR;
  const others = totalUsers - farmers - buyers;

  const farmerPercent = totalUsers ? (farmers / totalUsers) * 100 : 0;
  const buyerPercent = totalUsers ? (buyers / totalUsers) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Statistiques Globales</h2>
        <p className="text-white/60 mt-1">Analyse des performances de la plateforme AgriConnect</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPHIQUE VOLUME DES VENTES (MENSUEL) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><BarChart size={20} className="text-green-400" /> Volume des Ventes (Mensuel)</h3>
            <select className="bg-black/30 border border-white/20 rounded-lg py-1 px-3 text-xs text-white focus:outline-none">
              <option>Cette année</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyTotals.map((value, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-green-400/20 rounded-t-sm group-hover:bg-green-400 transition" 
                  style={{ height: `${(value / maxSale) * 100}%` }}
                />
                <span className="text-[10px] text-white/40">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPHIQUE RÉPARTITION PAR RÔLE */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><PieChart size={20} className="text-blue-400" /> Répartition par Rôle</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-white/10 relative flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-green-400 to-green-600 opacity-80" 
                style={{ clipPath: `polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, ${50 - farmerPercent / 2}% 0)` }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-blue-600 opacity-80" 
                style={{ clipPath: `polygon(50% 50%, 0 0, 50% 0)` }}
              />
              <div className="w-32 h-32 bg-[#0a0a12] rounded-full z-10 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{totalUsers}</span>
                <span className="text-xs text-white/50">Total</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Agriculteurs ({farmers})</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Acheteurs ({buyers})</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-white/20"></span> Autres ({others})</span>
          </div>
        </div>

        {/* INSIGHTS RAPIDES */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Activity size={20} className="text-yellow-400" /> Insights Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <p className="text-white/60 text-sm">Produit le plus vendu</p>
              <p className="text-xl font-bold text-white mt-1">{stats.topProduct.name}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1"><TrendingUp size={14} /> +{stats.topProduct.demand}% demande</p>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <p className="text-white/60 text-sm">Région la plus active</p>
              <p className="text-xl font-bold text-white mt-1">{stats.topRegion.region}</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1"><TrendingUp size={14} /> {stats.topRegion.percentage}% des ventes</p>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <p className="text-white/60 text-sm">Temps de livraison moyen</p>
              <p className="text-xl font-bold text-white mt-1">{stats.avgDeliveryDays} Jours</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1"><TrendingUp size={14} /> Performant</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistiques;