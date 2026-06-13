import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Ventes: React.FC = () => {
  const { user } = useAuth();
  const [ventes, setVentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Récupération des commandes où l'agriculteur est vendeur
        const response = await api.get(`/orders/farmer/${user.id}`);
        const farmerOrders = response.data;

        // Debug : afficher la structure brute (à enlever après)
        if (farmerOrders.length > 0) {
          console.log('🔍 Structure commande vendeur:', farmerOrders[0]);
        }

        // Mapping des statuts (backend -> français)
        const statusMap: Record<string, { label: string; icon: JSX.Element; color: string; bg: string }> = {
          'PENDING':     { label: 'En attente', icon: <Clock size={16} />, color: '#fbbf24', bg: 'bg-yellow-400/10 border-yellow-400/20' },
          'PREPARING':   { label: 'Préparation', icon: <Clock size={16} />, color: '#fbbf24', bg: 'bg-yellow-400/10 border-yellow-400/20' },
          'IN_TRANSIT':  { label: 'En transit', icon: <Clock size={16} />, color: '#60a5fa', bg: 'bg-blue-400/10 border-blue-400/20' },
          'DELIVERED':   { label: 'Livré', icon: <CheckCircle size={16} />, color: '#4ade80', bg: 'bg-green-400/10 border-green-400/20' },
          'CANCELLED':   { label: 'Annulé', icon: <AlertCircle size={16} />, color: '#f87171', bg: 'bg-red-400/10 border-red-400/20' },
        };

        // Calcul du revenu total (uniquement pour les commandes livrées)
        let revenue = 0;

        const formattedOrders = farmerOrders.map((order: any) => {
          // Récupération du nom de l'acheteur
          let buyerName = order.buyer_full_name || order.buyer?.name || order.buyer_name || 'Acheteur inconnu';
          if ((buyerName === 'Acheteur inconnu') && order.buyer) {
            buyerName = order.buyer.name || order.buyer.full_name || 'Acheteur inconnu';
          }

          // Récupération des produits (items ou champs plats)
          let productDisplay = '';
          let itemsList = order.items || order.order_items || [];
          
          if (itemsList.length > 0) {
            // Si la commande a un tableau d'items
            productDisplay = itemsList.map((item: any) => 
              `${item.product_name || item.name} (${item.quantity || item.qty} ${item.unit || ''})`
            ).join(', ');
          } else {
            // Structure plate : produit unique par commande
            const productName = order.product_name || order.name || 'Produit';
            const qty = order.quantity ?? order.qty ?? 1;
            const unit = order.unit ?? '';
            productDisplay = `${productName} (${qty} ${unit})`;
          }

          // Montant total
          const total = order.total_amount ?? order.totalAmount ?? order.total ?? 0;
          const statusKey = (order.status || '').toUpperCase();
          const statusInfo = statusMap[statusKey] || { 
            label: order.status || 'Inconnu', 
            icon: <FileText size={16} />, 
            color: '#fff', 
            bg: 'bg-white/10 border-white/20' 
          };

          // Ajouter au revenu si commande livrée
          if (statusKey === 'DELIVERED') revenue += total;

          return {
            id: order.id,
            shortId: `#${order.id.slice(0, 8)}`,
            buyerName,
            productDisplay,
            total,
            date: new Date(order.created_at).toLocaleDateString('fr-FR'),
            statusLabel: statusInfo.label,
            statusIcon: statusInfo.icon,
            statusColor: statusInfo.color,
            statusBg: statusInfo.bg,
            rawStatus: order.status,
          };
        });

        setVentes(formattedOrders);
        setTotalRevenue(revenue);
      } catch (err: any) {
        console.error('Erreur chargement ventes:', err);
        setError(err.response?.data?.message || 'Impossible de charger vos ventes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      // Mettre à jour l'état localement
      setVentes(prev => prev.map(v => {
        if (v.id === orderId) {
          const statusMap: Record<string, any> = {
            'PENDING':     { label: 'Paiement en attente', icon: <Clock size={16} />, color: '#fbbf24', bg: 'bg-yellow-400/10 border-yellow-400/20' },
            'PREPARING':   { label: 'Payé - Préparation', icon: <CheckCircle size={16} />, color: '#34d399', bg: 'bg-green-400/10 border-green-400/20' },
            'IN_TRANSIT':  { label: 'En transit', icon: <Clock size={16} />, color: '#60a5fa', bg: 'bg-blue-400/10 border-blue-400/20' },
            'DELIVERED':   { label: 'Livré', icon: <CheckCircle size={16} />, color: '#4ade80', bg: 'bg-green-400/10 border-green-400/20' },
            'CANCELLED':   { label: 'Annulé', icon: <AlertCircle size={16} />, color: '#f87171', bg: 'bg-red-400/10 border-red-400/20' },
          };
          const info = statusMap[newStatus];
          return { ...v, statusLabel: info.label, statusIcon: info.icon, statusColor: info.color, statusBg: info.bg, rawStatus: newStatus };
        }
        return v;
      }));
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      alert('Impossible de mettre à jour le statut.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Historique des Ventes</h2>
          <p className="text-white/60 mt-1">Suivez l'état de vos commandes et vos revenus</p>
        </div>
        <div className="bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-2 text-center">
          <p className="text-white/60 text-xs">Revenu total</p>
          <p className="text-green-400 font-bold text-xl">{totalRevenue.toLocaleString('fr-MG')} Ar</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-6">
        {ventes.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
            Aucune vente pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {ventes.map((vente) => (
              <div key={vente.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${vente.statusBg}`} style={{ color: vente.statusColor }}>
                    {vente.statusIcon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{vente.buyerName}</h3>
                    <p className="text-white/70 text-sm mt-1">{vente.productDisplay}</p>
                    <p className="text-white/40 text-xs mt-1">{vente.shortId} • {vente.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold text-green-400">{vente.total.toLocaleString('fr-MG')} Ar</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${vente.statusBg}`} style={{ color: vente.statusColor }}>
                      {vente.statusLabel}
                    </span>
                  </div>
                  
                  {/* Actions de gestion de commande */}
                  <div className="flex gap-2 mt-2">
                    {vente.rawStatus === 'PENDING' && (
                      <button 
                        onClick={() => handleUpdateStatus(vente.id, 'PREPARING')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/30 transition"
                      >
                        Valider paiement
                      </button>
                    )}
                    {vente.rawStatus === 'PREPARING' && (
                      <button 
                        onClick={() => handleUpdateStatus(vente.id, 'IN_TRANSIT')}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition"
                      >
                        Expédier
                      </button>
                    )}
                    {vente.rawStatus === 'IN_TRANSIT' && (
                      <button 
                        onClick={() => handleUpdateStatus(vente.id, 'DELIVERED')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/30 transition"
                      >
                        Marquer Livré
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Ventes;