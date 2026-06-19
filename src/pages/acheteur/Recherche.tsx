import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

const glassCard = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};

// Utilitaire image (identique au dashboard acheteur)
const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};

const Recherche: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Récupération des produits disponibles
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?is_available=true');
      // Trier par date récente (optionnel)
      const products = response.data.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mapped = products.map((p: any) => ({
        id: p.id,
        nom: p.name,
        agriculteur: p.farmer_name || p.farmer?.name || 'Agriculteur',
        lieu: p.description?.slice(0, 30) || 'Local',
        prix: p.price,
        unit: p.unit || 'kg',
        qty_available: p.quantity,
        note: 4.8, // À remplacer par une vraie note si disponible
        image_url: p.image_url,
        farmerId: p.farmer_id,
      }));
      setOffres(mapped);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setOrderError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuy = async (offre: any) => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter');
      return;
    }

    const maxStock = offre.qty_available;
    let unitLabel = offre.unit;
    if (unitLabel === 't') unitLabel = 'tonne(s)';
    if (unitLabel === 'kg') unitLabel = 'kilogramme(s)';
    
    const message = `Combien de ${unitLabel} de ${offre.nom} voulez-vous acheter ? (Max: ${maxStock} ${offre.unit})`;
    const q = window.prompt(message, '1');
    if (!q) return;
    
    const quantity = parseFloat(q);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantité invalide');
      return;
    }
    if (quantity > maxStock) {
      alert(`Stock insuffisant. Maximum : ${maxStock} ${offre.unit}`);
      return;
    }

    try {
      const totalAmount = quantity * offre.prix;
      // Structure attendue par le backend (à adapter si nécessaire)
      const orderPayload = {
        buyerId: user.id,
        farmerId: offre.farmerId,
        items: [
          {
            productId: offre.id,
            quantity: quantity,
            unit: offre.unit,
            price: offre.prix,
            product_name: offre.nom,
          },
        ],
        total_amount: totalAmount,
        status: 'PENDING',
      };

      await api.post('/orders', orderPayload);
      setOrderSuccess(`Commande passée : ${quantity} ${offre.unit} de ${offre.nom} - Total ${totalAmount.toLocaleString('fr-MG')} Ar`);
      setTimeout(() => setOrderSuccess(null), 5000);
      // Rafraîchir les produits pour mettre à jour le stock
      fetchProducts();
    } catch (error: any) {
      console.error('Erreur commande:', error);
      const msg = error.response?.data?.message || 'Erreur lors de la commande';
      setOrderError(msg);
      setTimeout(() => setOrderError(null), 5000);
    }
  };

  const filteredOffres = offres.filter(o => 
    o.nom.toLowerCase().includes(query.toLowerCase()) && o.qty_available > 0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Marketplace</h2>
          <p className="text-white/60 mt-1">Trouvez les meilleurs produits locaux</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
            />
          </div>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition border border-white/10">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Notifications temporaires */}
      {orderSuccess && (
        <div className="bg-green-500/20 border border-green-400 rounded-xl p-3 text-green-400 flex items-center gap-2">
          <CheckCircle size={18} /> {orderSuccess}
        </div>
      )}
      {orderError && (
        <div className="bg-red-500/20 border border-red-400 rounded-xl p-3 text-red-400 flex items-center gap-2">
          <AlertCircle size={18} /> {orderError}
        </div>
      )}

      {/* Liste des produits */}
      {loading ? (
        <div className="text-center text-white/50 py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          Chargement des produits...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredOffres.length === 0 ? (
            <div className="col-span-full text-center text-white/50 py-10">
              Aucun produit disponible pour le moment.
            </div>
          ) : (
            filteredOffres.map((offre) => (
              <div key={offre.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group hover:border-green-400/50 transition duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={getImageUrl(offre.image_url)} 
                    alt={offre.nom} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400">
                    <Star size={12} className="fill-yellow-400" /> {offre.note}
                  </div>
                  <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white">
                    Stock: {offre.qty_available} {offre.unit}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white truncate">{offre.nom}</h3>
                  <p className="text-white/50 text-sm mt-1 truncate">{offre.agriculteur} • {offre.lieu}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-green-400 font-bold">
                      {offre.prix.toLocaleString('fr-MG')} Ar/{offre.unit}
                    </p>
                    <button 
                      onClick={() => handleBuy(offre)}
                      className="p-2 bg-green-400/20 text-green-400 hover:bg-green-400 hover:text-black rounded-lg transition"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Recherche;