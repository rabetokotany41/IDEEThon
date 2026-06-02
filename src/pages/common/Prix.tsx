import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Prix: React.FC = () => {
  const [search, setSearch] = useState('');

  const prixData = [
    { produit: 'Riz (Makalioka)', region: 'Analamanga', prix: '3000 Ar/kg', tendance: 'stable' },
    { produit: 'Maïs', region: 'Vakinankaratra', prix: '1500 Ar/kg', tendance: 'hausse' },
    { produit: 'Haricot', region: 'Itasy', prix: '4500 Ar/kg', tendance: 'baisse' },
    { produit: 'Pomme de terre', region: 'Vakinankaratra', prix: '1200 Ar/kg', tendance: 'stable' },
  ];

  const filteredPrix = prixData.filter(p => p.produit.toLowerCase().includes(search.toLowerCase()) || p.region.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-green-800 border-b pb-2">Prix du marché en temps réel</h2>
      
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Rechercher par produit ou région..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
          Filtrer
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-50 text-green-800">
              <th className="p-4 border-b font-semibold">Produit</th>
              <th className="p-4 border-b font-semibold">Région</th>
              <th className="p-4 border-b font-semibold">Prix moyen</th>
              <th className="p-4 border-b font-semibold">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrix.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b last:border-0">
                <td className="p-4 font-medium">{item.produit}</td>
                <td className="p-4 text-gray-600">{item.region}</td>
                <td className="p-4 font-bold text-green-700">{item.prix}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.tendance === 'hausse' ? 'bg-red-100 text-red-700' : item.tendance === 'baisse' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {item.tendance.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {filteredPrix.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Aucun résultat trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prix;
