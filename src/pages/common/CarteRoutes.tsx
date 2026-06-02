import React, { useState } from 'react';
import { Map, AlertTriangle, CheckCircle, Camera } from 'lucide-react';

const CarteRoutes: React.FC = () => {
  const [etat, setEtat] = useState('bonne');

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Colonne Carte */}
      <div className="w-full md:w-2/3 space-y-4">
        <h2 className="text-2xl font-bold text-green-800">Carte des routes praticables</h2>
        <div className="bg-gray-200 rounded-xl h-[500px] flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
          {/* Placeholder Map */}
          <div className="absolute inset-0 bg-blue-50 opacity-50 flex items-center justify-center">
             <Map className="w-32 h-32 text-gray-400" />
          </div>
          <div className="z-10 text-center bg-white p-4 rounded-lg shadow-lg">
            <p className="font-bold text-gray-700">Intégration OpenStreetMap</p>
            <p className="text-sm text-gray-500">(Nécessite la connexion réseau pour charger les tuiles)</p>
          </div>
        </div>
      </div>

      {/* Colonne Signalement */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Signaler une route</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation de l'incident</label>
              <input type="text" placeholder="Ex: Axe Antsirabe - Betafo" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">État de la route</label>
              <div className="space-y-2">
                <label className={`flex items-center p-3 rounded border cursor-pointer ${etat === 'bonne' ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="etat" value="bonne" checked={etat === 'bonne'} onChange={() => setEtat('bonne')} className="text-green-600 focus:ring-green-500" />
                  <span className="ml-2 font-medium flex items-center"><CheckCircle size={16} className="text-green-500 mr-2" /> Route bonne</span>
                </label>
                <label className={`flex items-center p-3 rounded border cursor-pointer ${etat === 'degradee' ? 'bg-yellow-50 border-yellow-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="etat" value="degradee" checked={etat === 'degradee'} onChange={() => setEtat('degradee')} className="text-yellow-600 focus:ring-yellow-500" />
                  <span className="ml-2 font-medium flex items-center"><AlertTriangle size={16} className="text-yellow-500 mr-2" /> Route dégradée</span>
                </label>
                <label className={`flex items-center p-3 rounded border cursor-pointer ${etat === 'impraticable' ? 'bg-red-50 border-red-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="etat" value="impraticable" checked={etat === 'impraticable'} onChange={() => setEtat('impraticable')} className="text-red-600 focus:ring-red-500" />
                  <span className="ml-2 font-medium flex items-center"><AlertTriangle size={16} className="text-red-600 mr-2" /> Impraticable</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optionnelle)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Télécharger une photo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
              Envoyer le signalement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarteRoutes;
