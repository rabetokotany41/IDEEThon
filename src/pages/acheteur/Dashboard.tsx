import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Package, Star, Search, ArrowUpRight, Clock, CheckCircle, XCircle, Filter, TrendingDown,
  Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

/* Styles */
const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};

const card = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
});

const ACCENT = '#60a5fa';

// Utilitaire image (identique au reste de l'app)
const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'https://backendidethon.onrender.com').replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};

// Composant mini image produit
const ProductThumb = ({ src, alt }: { src: string | null; alt: string }) => {
  const [error, setError] = useState(false);
  const url = getImageUrl(src);
  if (!url || error) {
    return <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center"><ImageIcon size={16} className="text-white/30" /></div>;
  }
  return <img src={url} alt={alt} className="w-12 h-12 rounded-lg object-cover" onError={() => setError(true)} />;
};

const DashboardAcheteur: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState([
    { label: 'Budget disponible', value: '0', unit: 'Ar', icon: TrendingDown, accent: '#60a5fa', trend: 'Actif' },
    { label: 'Commandes en cours', value: '0', unit: '', icon: Package, accent: '#a78bfa', trend: 'En attente' },
    { label: 'Achats ce mois', value: '0', unit: '', icon: ShoppingCart, accent: '#818cf8', trend: 'Mois courant' },
    { label: 'Note acheteur', value: '4.8', unit: '/5', icon: Star, accent: '#fbbf24', trend: 'Excellent' },
  ]);

  const [orders, setOrders] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Récupération des données
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Commandes de l'acheteur
        const ordersRes = await api.get(`/orders/buyer/${user.id}`);
        const buyerOrders = ordersRes.data;

        // 2. Calcul des stats
        const totalSpent = buyerOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const activeOrdersCount = buyerOrders.filter((o: any) => 
          o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
        ).length;
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyPurchases = buyerOrders.filter((o: any) => new Date(o.created_at) >= startOfMonth).length;

        // Budget initial (à adapter si vous avez un vrai endpoint)
        const initialBudget = 1000000; // Remplacer par appel API /users/buyer/budget si existant
        const remainingBudget = initialBudget - totalSpent;

        setStats([
          { label: 'Budget disponible', value: Math.max(0, remainingBudget).toLocaleString('fr-MG'), unit: 'Ar', icon: TrendingDown, accent: '#60a5fa', trend: 'Actif' },
          { label: 'Commandes en cours', value: activeOrdersCount.toString(), unit: '', icon: Package, accent: '#a78bfa', trend: 'En attente' },
          { label: 'Achats ce mois', value: monthlyPurchases.toString(), unit: '', icon: ShoppingCart, accent: '#818cf8', trend: 'Mois courant' },
          { label: 'Note acheteur', value: '4.8', unit: '/5', icon: Star, accent: '#fbbf24', trend: 'Excellent' },
        ]);

        // 3. Formatage des commandes
        const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
          'PENDING':    { label: 'En attente', icon: <Clock size={12} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
          'PREPARING':  { label: 'Préparation', icon: <Clock size={12} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
          'IN_TRANSIT': { label: 'En transit', icon: <Clock size={12} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
          'DELIVERED':  { label: 'Livré', icon: <CheckCircle size={12} />, color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
          'CANCELLED':  { label: 'Annulé', icon: <XCircle size={12} />, color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
        };

        const formattedOrders = buyerOrders.map((order: any) => {
          const firstItem = order.items?.[0];
          const productName = firstItem?.product_name || 'Produit';
          const sellerName = firstItem?.farmer_name || 'Vendeur inconnu';
          const quantity = order.items?.length ? `${order.items.length} art.` : '1 art.';
          const cfg = statusConfig[order.status] || { label: order.status, icon: <AlertCircle size={12} />, color: '#fff', bg: 'rgba(255,255,255,0.1)' };
          return {
            id: `#${order.id.slice(0, 8)}`,
            product: productName,
            qty: quantity,
            seller: sellerName,
            amount: (order.total_amount || 0).toLocaleString('fr-MG') + ' Ar',
            status: cfg.label,
            statusIcon: cfg.icon,
            statusColor: cfg.color,
            statusBg: cfg.bg,
            date: new Date(order.created_at).toLocaleDateString('fr-FR'),
            rawStatus: order.status,
            orderId: order.id,
          };
        });
        setOrders(formattedOrders);

        // 4. Suggestions : produits récents (max 4)
        const productsRes = await api.get('/products?limit=4&sort=created_at:desc');
        const productSuggestions = productsRes.data.slice(0, 4).map((p: any) => ({
          id: p.id,
          product: p.name,
          region: p.description?.slice(0, 30) || 'Région inconnue',
          price: `${p.price.toLocaleString('fr-MG')} Ar/${p.unit || 'kg'}`,
          rating: 4.8, // À remplacer par une vraie note si disponible
          image_url: p.image_url,
        }));
        setSuggestions(productSuggestions);
      } catch (err: any) {
        console.error('Erreur chargement dashboard acheteur:', err);
        setError(err.response?.data?.message || 'Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filters = ['Tous', 'En attente', 'En transit', 'Livré', 'Annulé'];
  const shown = filter === 'Tous'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 bg-white/5 rounded-2xl">
        <AlertCircle size={32} className="mx-auto mb-3" />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg text-white">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-white font-bold text-2xl">Tableau de bord Acheteur 🛒</h2>
          <p className="text-white/40 text-sm mt-1">Gérez vos achats et explorez le marché agricole.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/acheteur/recherche')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 24px rgba(99,102,241,0.28)' }}
        >
          <Search size={16} /> Chercher des produits
        </motion.button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...card(i)} style={glass} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.accent + '1a', border: `1px solid ${s.accent}30` }}>
                  <Icon size={19} style={{ color: s.accent }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: s.accent + '18', color: s.accent }}>{s.trend}</span>
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium mb-1">{s.label}</p>
                <p className="text-white font-bold text-2xl leading-none">{s.value}
                  {s.unit && <span className="text-white/40 text-sm font-normal ml-1">{s.unit}</span>}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Section principale : commandes + suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Colonne des commandes */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Mes Commandes</h3>
            <button
              onClick={() => navigate('/acheteur/commandes')}
              className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition"
              style={{ color: ACCENT }}
            >
              Tout voir <ArrowUpRight size={13} />
            </button>
          </div>

          {/* Filtres */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={filter === f
                  ? { background: ACCENT, color: '#000' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {f}
              </button>
            ))}
          </div>

          {/* Liste des commandes */}
          <div className="space-y-3">
            {shown.length === 0 ? (
              <p className="text-white/40 text-center py-8">Aucune commande trouvée.</p>
            ) : (
              shown.map((order, idx) => (
                <div
                  key={order.orderId || idx}
                  onClick={() => navigate('/acheteur/commandes')}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
                    <Package size={16} style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="text-white font-semibold text-sm truncate">{order.product}</p>
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                        style={{ background: order.statusBg, color: order.statusColor }}>
                        {order.statusIcon} {order.status}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs mt-0.5">{order.id} · {order.qty} · {order.seller}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-sm">{order.amount}</p>
                    <p className="text-white/30 text-xs">{order.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Suggestions de produits */}
        <motion.div {...card(5)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Suggestions</h3>
            <Filter size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <p className="text-white/40 text-center py-8">Aucune suggestion pour le moment</p>
            ) : (
              suggestions.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigate('/acheteur/recherche')}
                  className="p-4 rounded-xl transition-all cursor-pointer group hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-start gap-3">
                    <ProductThumb src={prod.image_url} alt={prod.product} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-white font-bold text-sm truncate">{prod.product}</p>
                        <div className="flex items-center gap-1 text-xs ml-2" style={{ color: '#fbbf24' }}>
                          <Star size={11} fill="currentColor" /> {prod.rating}
                        </div>
                      </div>
                      <p className="text-white/35 text-xs mt-0.5 truncate">{prod.region}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm" style={{ color: ACCENT }}>{prod.price}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/acheteur/recherche'); }}
                          className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(96,165,250,0.15)', color: ACCENT, border: '1px solid rgba(96,165,250,0.25)' }}
                        >
                          Commander
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardAcheteur;