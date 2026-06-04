import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, MapPin, CheckCircle } from 'lucide-react';

const Location: React.FC = () => {
  const [rented, setRented] = useState<number | null>(null);

  const materiels = [
    { id: 1, nom: 'Tracteur Kubota 40cv', proprio: 'Coopérative Beta', lieu: 'Antsirabe (10km)', prix: '150,000 Ar/jour', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0a3834?q=80&w=300&auto=format&fit=crop' },
    { id: 2, nom: 'Motoculteur Honda', proprio: 'Jean Rakoto', lieu: 'Betafo (5km)', prix: '45,000 Ar/jour', image: 'https://images.unsplash.com/photo-1628135805553-61e27a9cb25b?q=80&w=300&auto=format&fit=crop' },
    { id: 3, nom: 'Pompe à eau thermique', proprio: 'Ferme Vakinankaratra', lieu: 'Antsirabe (12km)', prix: '25,000 Ar/jour', image: 'https://images.unsplash.com/photo-1622322304855-385002b84cf1?q=80&w=300&auto=format&fit=crop' },
  ];

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materiels.map((mat) => (
          <div key={mat.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group hover:border-green-400/50 transition duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={mat.image} alt={mat.nom} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                <Wrench size={12} className="text-green-400" /> Disponible
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{mat.nom}</h3>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                  <MapPin size={14} /> {mat.lieu}
                </div>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Wrench size={14} /> {mat.proprio}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-green-400 font-bold text-xl mb-4">{mat.prix}</p>
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
        ))}
      </div>
    </motion.div>
  );
};

export default Location;
