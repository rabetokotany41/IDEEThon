import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../hooks/useAuth';
import Login from '../../components/layout/Auth/Login';
import Register from '../../components/layout/Auth/Resisteur';
const Connexion: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('0340000000');

  const handleLogin = (role: UserRole) => {
    login(phone, role);
    switch (role) {
      case 'agriculteur': navigate('/agriculteur/dashboard'); break;
      case 'acheteur': navigate('/acheteur/recherche'); break;
      case 'agent': navigate('/agent/agriculteurs'); break;
      case 'admin': navigate('/admin'); break;
      default: navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Connexion</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          placeholder="034 XX XXX XX"
        />
        <p className="text-xs text-gray-500 mt-2">Pour ce MVP, choisissez simplement le rôle avec lequel vous souhaitez tester la plateforme.</p>
      </div>

      <div className="space-y-3">
        <button onClick={() => handleLogin('agriculteur')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
          Se connecter en tant qu'Agriculteur
        </button>
        <button onClick={() => handleLogin('acheteur')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Se connecter en tant qu'Acheteur
        </button>
        <button onClick={() => handleLogin('agent')} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
          Se connecter en tant qu'Agent Relais
        </button>
        <button onClick={() => handleLogin('admin')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
          Se connecter en tant qu'Admin
        </button>
      </div>
    </div>
  );
};

export default Connexion;
