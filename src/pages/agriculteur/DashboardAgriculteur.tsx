import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ShoppingBag, Cloud, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardAgriculteur: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-green-800">Bonjour, {user?.displayName || 'Agriculteur'}</h2>
        <Link to="/agriculteur/publier-offre" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center">
          <PlusCircle size={18} className="mr-2" />
          Nouvelle offre
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <ShoppingBag className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-green-800 font-medium">Offres actives</p>
            <p className="text-2xl font-bold text-green-900">2</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Cloud className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">Météo aujourd'hui</p>
            <p className="text-xl font-bold text-blue-900">26°C, Ensoleillé</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-yellow-800 font-medium">Alertes Routes</p>
            <p className="text-xl font-bold text-yellow-900">1 route dégradée</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Vos offres récentes</h3>
          <Link to="/agriculteur/offres" className="text-sm text-green-600 hover:underline">Voir tout</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="p-4 font-medium">Produit</th>
              <th className="p-4 font-medium">Quantité</th>
              <th className="p-4 font-medium">Prix / kg</th>
              <th className="p-4 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">Riz (Makalioka)</td>
              <td className="p-4">500 kg</td>
              <td className="p-4 text-green-700 font-bold">2800 Ar</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">En ligne</span></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-medium">Maïs</td>
              <td className="p-4">200 kg</td>
              <td className="p-4 text-green-700 font-bold">1400 Ar</td>
              <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">En attente (hors ligne)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAgriculteur;
