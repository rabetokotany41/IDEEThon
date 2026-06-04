import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';

const Recherche: React.FC = () => {
  const [query, setQuery] = useState('');

  const offres = [
    { id: 1, nom: 'Tomates rondes', agriculteur: 'Jean Rakoto', lieu: 'Itasy', prix: '3,000 Ar/kg', note: 4.8, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop' },
    { id: 2, nom: 'Riz rouge (Gasy)', agriculteur: 'Coop. Analamanga', lieu: 'Antananarivo', prix: '1,800 Ar/kg', note: 4.9, img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=200&auto=format&fit=crop' },
    { id: 3, nom: 'Pommes de terre', agriculteur: 'Ferme Vakinankaratra', lieu: 'Antsirabe', prix: '1,200 Ar/kg', note: 4.5, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=200&auto=format&fit=crop' },
    { id: 4, nom: 'Maïs', agriculteur: 'Randria', lieu: 'Fianarantsoa', prix: '1,500 Ar/kg', note: 4.2, img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200&auto=format&fit=crop' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offres.filter(o => o.nom.toLowerCase().includes(query.toLowerCase())).map((offre) => (
          <div key={offre.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group hover:border-green-400/50 transition duration-300">
            <div className="h-40 overflow-hidden relative">
              <img src={offre.img} alt={offre.nom} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400">
                <Star size={12} className="fill-yellow-400" /> {offre.note}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white">{offre.nom}</h3>
              <p className="text-white/50 text-sm mt-1">{offre.agriculteur} • {offre.lieu}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-green-400 font-bold">{offre.prix}</p>
                <button className="p-2 bg-green-400/20 text-green-400 hover:bg-green-400 hover:text-black rounded-lg transition">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Recherche;
