import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, MapPin, CheckCircle, Plus, X } from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

const Location: React.FC = () => {
  const { user } = useAuth();
  const [rented, setRented] = useState<number | null>(null);
  const [materiels, setMateriels] = useState<any[]>([]);
  const [myEquipment, setMyEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', pricePerDay: '', location: '' });

  useEffect(() => {
    if (!user) return;
    const fetchEquipment = async () => {
      try {
        const response = await api.get('/equipment');
        setMateriels(response.data);

        const myResponse = await api.get(`/equipment/owner/${user.id}`);
        setMyEquipment(myResponse.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [user]);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price_per_day: parseFloat(formData.pricePerDay),
        location: formData.location,
      };
      const response = await api.post('/equipment', payload);
      setMyEquipment([...myEquipment, response.data]);
      setShowModal(false);
      setFormData({ name: '', description: '', pricePerDay: '', location: '' });
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-white">Location de Matériel</h2>
          <p className="text-white/60 mt-1">Louez des équipements agricoles près de chez vous</p>
        </div>
        <button onClick={() => setShowModal(true)} className="cursor-pointer hidden md:flex items-center gap-2 px-3 h-9 rounded-full text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10">
          <Plus size={20} />
          <span className="hidden sm:inline">Ajouter mon matériel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-white/50 py-8">Chargement...</div>
        ) : materiels.length === 0 ? (
          <div className="col-span-full text-center text-white/50 py-8">Aucun matériel disponible</div>
        ) : (
          materiels.map((mat) => (
            <div key={mat.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group hover:border-green-400/50 transition duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative bg-black/30 flex items-center justify-center">
                {mat.image_url ? (
                  <img src={mat.image_url} alt={mat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                  <Wrench size={48} className="text-white/20" />
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                  <Wrench size={12} className="text-green-400" /> Disponible
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white mb-2">{mat.name}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                    <MapPin size={14} /> {mat.location || 'Non spécifié'}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Wrench size={14} /> {mat.owner_full_name || 'Propriétaire inconnu'}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-green-400 font-bold text-xl mb-4">{mat.price_per_day?.toLocaleString('fr-MG')} Ar/jour</p>
                  {rented === mat.id ? (
                    <div className="w-full py-3 bg-green-400/20 text-green-400 border border-green-400/30 font-bold rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Demande Envoyée
                    </div>
                  ) : (
                    <button
                      onClick={() => setRented(mat.id)}
                      className="w-full py-3 bg-white/10 text-white hover:bg-green-400 hover:text-black font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} /> Demander une réservation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
 
      {/* Modal for adding equipment */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Ajouter mon matériel</h3>
              <button onClick={() => setShowModal(false)} className="cursor-pointer hidden md:flex items-center gap-2 px-3 h-9 rounded-full text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Nom du matériel</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Prix par jour (Ar)</label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Localisation</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer hidden md:flex items-center gap-2 px-3 h-9 rounded-full text-sm font-medium transition bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Location;