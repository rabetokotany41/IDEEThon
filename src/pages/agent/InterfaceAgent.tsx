import React, { useState } from 'react';
import { UserPlus, RefreshCw, Smartphone } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

const InterfaceAgent: React.FC = () => {
  const { syncPending, forceSync } = useOffline();
  const [phone, setPhone] = useState('');
  const [nom, setNom] = useState('');

  const handleAddFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Agriculteur ${nom} (${phone}) ajouté au carnet local.`);
    setNom('');
    setPhone('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-yellow-800">Interface Agent Relais</h2>
        <button 
          onClick={forceSync}
          className={`px-4 py-2 rounded-lg font-medium flex items-center text-white ${syncPending > 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={syncPending === 0}
        >
          <RefreshCw size={18} className={`mr-2 ${syncPending > 0 ? 'animate-spin' : ''}`} />
          Synchroniser ({syncPending})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center mb-4 text-yellow-700">
            <UserPlus size={24} className="mr-2" />
            <h3 className="text-xl font-bold">Inscrire un agriculteur</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Ajoutez un agriculteur sans smartphone à votre liste pour publier des offres en son nom.</p>
          
          <form onSubmit={handleAddFarmer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input 
                type="text" 
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Rakoto Jean"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone (SMS)</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03X XX XXX XX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
              Ajouter au carnet
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center mb-4 text-green-700">
            <Smartphone size={24} className="mr-2" />
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-green-50 hover:bg-green-100 text-green-800 font-medium py-3 px-4 rounded-lg border border-green-200 text-left">
              1. Saisir les prix du marché local
            </button>
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium py-3 px-4 rounded-lg border border-blue-200 text-left">
              2. Publier une offre pour un agriculteur
            </button>
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-200 text-left">
              3. Consulter les demandes d'aide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceAgent;
