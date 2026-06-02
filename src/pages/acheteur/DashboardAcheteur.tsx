import React, { useState } from 'react';
import { Search, Phone, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardAcheteur: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const offres = [
    { id: 1, agriculteur: 'Jean Rakoto', produit: 'Riz (Makalioka)', region: 'Itasy', quantite: '1200 kg', prix: '2750 Ar', phone: '034 11 222 33' },
    { id: 2, agriculteur: 'Marie Rasoa', produit: 'Pomme de terre', region: 'Vakinankaratra', quantite: '500 kg', prix: '1100 Ar', phone: '032 44 555 66' },
    { id: 3, agriculteur: 'Pierre Rabe', produit: 'Maïs', region: 'Vakinankaratra', quantite: '800 kg', prix: '1450 Ar', phone: '033 77 888 99' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-900">Espace Acheteur - {user?.displayName}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Que recherchez-vous ? (ex: Riz, Itasy...)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center border border-gray-300">
          <Filter size={18} className="mr-2" /> Filtres
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offres.map((offre) => (
          <div key={offre.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
            <div className="bg-green-50 px-4 py-3 border-b flex justify-between items-center">
              <span className="font-bold text-green-800">{offre.produit}</span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">{offre.region}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Quantité:</span>
                <span className="font-medium">{offre.quantite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Prix / kg:</span>
                <span className="font-bold text-orange-600 text-lg">{offre.prix}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-500 text-sm">Vendeur:</span>
                <span className="font-medium text-sm">{offre.agriculteur}</span>
              </div>
              <button 
                onClick={() => alert(`Contactez le vendeur au ${offre.phone}`)}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition"
              >
                <Phone size={16} className="mr-2" /> Appeler le vendeur
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAcheteur;
