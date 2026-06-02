import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, WifiOff } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

const PublierOffre: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline, addPendingSync } = useOffline();
  
  const [produit, setProduit] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOnline) {
      alert("Offre publiée avec succès !");
    } else {
      addPendingSync();
      alert("Vous êtes hors-ligne. L'offre est sauvegardée et sera publiée dès que le réseau sera disponible.");
    }
    navigate('/agriculteur/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Publier une nouvelle offre</h2>

      {!isOnline && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 flex items-center rounded">
          <WifiOff size={20} className="mr-3" />
          <p>Mode hors-ligne actif. Les données seront stockées localement.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produit agricole</label>
          <select 
            required
            value={produit}
            onChange={(e) => setProduit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Sélectionnez un produit...</option>
            <option value="riz">Riz (Makalioka)</option>
            <option value="mais">Maïs</option>
            <option value="haricot">Haricot</option>
            <option value="pomme_terre">Pomme de terre</option>
            <option value="arachide">Arachide</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (kg)</label>
            <input 
              type="number" 
              required
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Ex: 500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix souhaité (Ar / kg)</label>
            <input 
              type="number" 
              required
              min="1"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="Ex: 2800"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de disponibilité prévue</label>
          <input 
            type="date" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Annuler
          </button>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
            <Save size={18} className="mr-2" />
            {isOnline ? 'Publier l\'offre' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublierOffre;
