import React from 'react';
import { Users, ShieldAlert, Activity, Check } from 'lucide-react';

const DashboardAdmin: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-purple-900">Administration Système</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-l-4 border-blue-500 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Utilisateurs Actifs</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">1,245</p>
          </div>
          <Users className="text-blue-200" size={40} />
        </div>

        <div className="bg-white border-l-4 border-green-500 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Offres en ligne</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">342</p>
          </div>
          <Activity className="text-green-200" size={40} />
        </div>

        <div className="bg-white border-l-4 border-red-500 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Signalements</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
          </div>
          <ShieldAlert className="text-red-200" size={40} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Modération : Offres signalées</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            <li className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">Offre #4521 - Prix anormalement bas</p>
                <p className="text-sm text-gray-500">Signalé par 2 utilisateurs</p>
              </div>
              <div className="space-x-2 flex">
                <button className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100" title="Valider">
                  <Check size={18} />
                </button>
                <button className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100" title="Supprimer">
                  <ShieldAlert size={18} />
                </button>
              </div>
            </li>
            <li className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">Offre #4510 - Contenu inapproprié</p>
                <p className="text-sm text-gray-500">Signalé par 1 utilisateur</p>
              </div>
              <div className="space-x-2 flex">
                <button className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100">
                  <Check size={18} />
                </button>
                <button className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100">
                  <ShieldAlert size={18} />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Gestion Utilisateurs (Agents)</h3>
          </div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="p-3 font-medium">Nom</th>
                <th className="p-3 font-medium">Région</th>
                <th className="p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Agent Rabe</td>
                <td className="p-3 text-gray-600">Itasy</td>
                <td className="p-3"><button className="text-blue-600 font-medium">Modifier</button></td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Agent Rasoa</td>
                <td className="p-3 text-gray-600">Vakinankaratra</td>
                <td className="p-3"><button className="text-blue-600 font-medium">Modifier</button></td>
              </tr>
            </tbody>
          </table>
          <div className="p-3 bg-gray-50 border-t text-center">
             <button className="text-purple-600 font-medium text-sm">Ajouter un nouvel agent relais</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
