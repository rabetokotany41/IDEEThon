import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Commandes: React.FC = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/buyer/${user.id}`);
        const formatted = response.data.map((o: any) => {
          let etape = 1;
          if (o.status === 'IN_TRANSIT') etape = 2;
          if (o.status === 'DELIVERED') etape = 3;

          const itemsName = o.items?.map((i:any) => `${i.product_name} (${i.quantity})`).join(', ');
          const sellerName = o.items?.[0]?.farmer_name || 'Vendeur inconnu';

            return {
              id: `#CMD-${o.id.slice(0, 6).toUpperCase()}`,
              produit: itemsName || 'Commande',
              vendeur: sellerName,
              total: o.total_amount.toLocaleString('fr-MG') + ' Ar',
              statut: o.status,
              date: new Date(o.created_at).toLocaleDateString('fr-FR'),
              etape,
              delivery: o.delivery, // <-- Ajout ici
            };
          });
          setCommandes(formatted);
        } catch (error) {
          console.error('Error fetching buyer orders:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }, [user]);
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-serif text-white">Mes Commandes</h2>
          <p className="text-white/60 mt-1">Suivi de vos achats et livraisons</p>
        </div>
  
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-6">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-white/50 py-8">Chargement de vos commandes...</div>
            ) : commandes.length === 0 ? (
              <div className="text-center text-white/50 py-8">Aucune commande trouvée.</div>
            ) : commandes.map((cmd) => (
              <div key={cmd.id} className="bg-black/20 rounded-xl border border-white/5 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg">{cmd.produit}</h3>
                    <p className="text-white/60 text-sm">Vendeur: {cmd.vendeur} • {cmd.id}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-green-400">{cmd.total}</p>
                    <p className="text-white/40 text-xs mt-1">{cmd.date}</p>
                  </div>
                </div>
                
                {/* DÉTAILS DU TRAJET */}
                {cmd.delivery && (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <p className="text-white/80 font-bold mb-2 flex items-center gap-2">
                      <Truck size={16} className="text-orange-400" /> Informations de Livraison
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/60">
                      <div>
                        <p><strong className="text-white/80">Trajet :</strong> {cmd.delivery.origin} → {cmd.delivery.destination}</p>
                        <p><strong className="text-white/80">Distance estimée :</strong> {cmd.delivery.distance || 'N/A'} km</p>
                        <p><strong className="text-white/80">Prix livraison :</strong> {cmd.delivery.delivery_price.toLocaleString('fr-MG')} Ar</p>
                      </div>
                      <div>
                        <p><strong className="text-white/80">Transporteur :</strong> {cmd.delivery.transporter_name || 'En attente d\'un transporteur'}</p>
                        <p><strong className="text-white/80">Contact :</strong> {cmd.delivery.transporter_phone || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* PROGRESS BAR */}
                <div className="relative pt-4">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: cmd.etape === 1 ? '10%' : cmd.etape === 2 ? '50%' : '100%' }}
                      transition={{ duration: 1 }}
                      className="h-full bg-green-400"
                    />
                  </div>
                  <div className="relative flex justify-between">
                    <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 1 ? 'text-green-400' : 'text-white/40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 1 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                        <Package size={16} />
                      </div>
                      <span className="text-xs font-bold hidden sm:block">Préparation</span>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 2 ? 'text-green-400' : 'text-white/40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 2 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                        <Truck size={16} />
                      </div>
                      <span className="text-xs font-bold hidden sm:block">En route</span>
                    </div>
                    <div className={`flex flex-col items-center gap-2 ${cmd.etape >= 3 ? 'text-green-400' : 'text-white/40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cmd.etape >= 3 ? 'bg-green-400 text-black' : 'bg-white/10'}`}>
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-xs font-bold hidden sm:block">Livré</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Commandes;