import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Produits: React.FC = () => {
  const produits = [
    { id: 1, nom: 'Maïs biologique', quantite: '500 kg', prix: '2,000 Ar/kg', statut: 'En vente', date: '12 Oct 2023' },
    { id: 2, nom: 'Tomates fraîches', quantite: '50 kg', prix: '3,500 Ar/kg', statut: 'Rupture', date: '10 Oct 2023' },
    { id: 3, nom: 'Riz rouge', quantite: '1,200 kg', prix: '1,800 Ar/kg', statut: 'En vente', date: '05 Oct 2023' },
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
          <h2 className="text-3xl font-serif text-white">Mes Produits</h2>
          <p className="text-white/60 mt-1">Gérez votre catalogue de récoltes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 transition">
          <Plus size={20} />
          <span className="hidden sm:inline">Ajouter un produit</span>
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">Nom du Produit</th>
                <th className="p-4 font-medium">Quantité Disponible</th>
                <th className="p-4 font-medium">Prix Unitaire</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Date d'ajout</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((prod) => (
                <tr key={prod.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 font-bold text-white">{prod.nom}</td>
                  <td className="p-4 text-white/80">{prod.quantite}</td>
                  <td className="p-4 text-green-400 font-semibold">{prod.prix}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${prod.statut === 'En vente' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                      {prod.statut}
                    </span>
                  </td>
                  <td className="p-4 text-white/50 text-sm">{prod.date}</td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Produits;
