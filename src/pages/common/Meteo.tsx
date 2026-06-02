import React from 'react';
import { CloudRain, Sun, Wind, MapPin } from 'lucide-react';

const Meteo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-green-800 border-b pb-2">Météo Agricole</h2>

      <div className="flex space-x-4 mb-6">
        <select className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
          <option>Sélectionnez votre région</option>
          <option value="analamanga">Analamanga</option>
          <option value="vakinankaratra">Vakinankaratra</option>
          <option value="itasy">Itasy</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
          <MapPin size={18} className="mr-2" />
          Me géolocaliser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aujourd'hui */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center transform scale-105 shadow-md">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Aujourd'hui</h3>
          <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-3xl font-bold text-gray-800 mb-1">26°C</p>
          <p className="text-blue-800 font-medium">Ensoleillé</p>
          <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-left space-y-2">
            <p className="flex justify-between"><span>Précipitations:</span> <b>0%</b></p>
            <p className="flex justify-between"><span>Vent:</span> <b>15 km/h</b></p>
          </div>
        </div>

        {/* Demain */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Demain</h3>
          <CloudRain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-2xl font-bold text-gray-800 mb-1">22°C</p>
          <p className="text-gray-600 font-medium">Risque d'averses</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-left space-y-2">
            <p className="flex justify-between text-gray-600"><span>Précipitations:</span> <b>60%</b></p>
            <p className="flex justify-between text-gray-600"><span>Vent:</span> <b>20 km/h</b></p>
          </div>
        </div>

        {/* Après-demain */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Après-demain</h3>
          <Wind className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-2xl font-bold text-gray-800 mb-1">24°C</p>
          <p className="text-gray-600 font-medium">Venteux</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-left space-y-2">
            <p className="flex justify-between text-gray-600"><span>Précipitations:</span> <b>10%</b></p>
            <p className="flex justify-between text-gray-600"><span>Vent:</span> <b>35 km/h</b></p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded text-yellow-800 text-sm">
        <p className="font-bold">Conseil météo :</p>
        <p>Les conditions de demain ne sont pas favorables pour le traitement phytosanitaire (risque de pluie). Privilégiez les récoltes aujourd'hui.</p>
      </div>
    </div>
  );
};

export default Meteo;
