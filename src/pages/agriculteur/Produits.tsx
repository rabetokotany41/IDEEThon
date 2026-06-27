import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  unit: string;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
}

// Utilitaire pour construire l'URL complète de l'image
const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  // Si c'est déjà une URL absolue, on la retourne
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || 'https://backendidethon.onrender.com').replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};

// Composant d'image avec fallback
const ProductImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);

  if (!imageUrl || error) {
    return <ImageIcon size={20} className="text-white/30" />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
};

const Produits: React.FC = () => {
  const { user } = useAuth();
  const [produits, setProduits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products/farmer/${user.id}`);
        setProduits(response.data);
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', quantity: '', unit: 'kg' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit || 'kg',
    });
    setImageFile(null);
    // Utiliser la même fonction utilitaire pour l'aperçu
    setImagePreview(getImageUrl(product.image_url));
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Impossible de supprimer le produit. Réessayez.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('price', formData.price);
      payload.append('quantity', formData.quantity);
      payload.append('unit', formData.unit);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editingProduct) {
        const response = await api.patch(`/products/${editingProduct.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProduits((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? response.data : p))
        );
      } else {
        const response = await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProduits((prev) => [response.data, ...prev]);
      }
      setShowModal(false);
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de l’enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white">Mes Produits</h2>
          <p className="text-white/60 mt-1">Gérez votre catalogue de récoltes avec photos</p>
        </div>
        <button
          onClick={handleAdd}
          className="cursor-pointer flex items-center gap-2 px-3 h-9 rounded-full text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10">
          <Plus size={20} />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Tableau des produits */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Quantité</th>
                <th className="p-4 font-medium">Prix unitaire</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/50">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400" />
                    </div>
                  </td>
                </tr>
              ) : produits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/50">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Aucun produit. Cliquez sur "Ajouter" pour commencer à vendre.</p>
                  </td>
                </tr>
              ) : (
                produits.map((prod) => (
                  <tr key={prod.id} className="border-b border-white/5 hover:bg-white/10 transition group">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex items-center justify-center border border-white/10">
                        <ProductImage src={prod.image_url} alt={prod.name} />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">{prod.name}</td>
                    <td className="p-4 text-white/80">
                      <span className="bg-white/10 px-2 py-1 rounded-md">{prod.quantity} {prod.unit}</span>
                    </td>
                    <td className="p-4 text-green-400 font-semibold">
                      {prod.price.toLocaleString('fr-MG')} Ar/{prod.unit}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${prod.is_available
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}
                      >
                        {prod.is_available ? 'En vente' : 'Rupture'}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-sm">
                      {new Date(prod.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="cursor-pointer p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-400 transition"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="cursor-pointer p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal transparente (glassmorphism) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Photo Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-green-400 transition">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition" />
                    ) : (
                      <ImageIcon size={32} className="text-white/30 group-hover:text-green-400 transition mb-2" />
                    )}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition ${imagePreview ? '' : 'hidden'}`}>
                      <span className="text-xs font-semibold text-white">Changer</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-2">Format: JPG, PNG. Max: 2MB.</p>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1.5 ml-1">Nom du produit *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                    placeholder="ex: Tomates bio"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5 ml-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition resize-none"
                    placeholder="Détails, qualité, variété..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 ml-1">Prix (Ar) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 ml-1">Quantité *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5 ml-1">Unité</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 appearance-none"
                  >
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="t">Tonne (t)</option>
                    <option value="g">Gramme (g)</option>
                    <option value="l">Litre (L)</option>
                    <option value="unité">Unité (pièce)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-green-600/70"
                >
                  {submitting
                    ? 'Enregistrement...'
                    : editingProduct
                      ? 'Modifier le produit'
                      : 'Ajouter au catalogue'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Produits;