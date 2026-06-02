import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, Truck } from 'lucide-react';

const Accueil: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <section className="text-center bg-green-50 p-12 rounded-2xl w-full">
        <h1 className="text-4xl font-extrabold text-green-900 mb-4">Bienvenue sur AgriConnect Madagascar</h1>
        <p className="text-lg text-green-700 mb-8 max-w-2xl mx-auto">
          La plateforme qui connecte directement les agriculteurs malgaches aux acheteurs, sans intermédiaire.
        </p>
        <Link to="/connexion" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-lg transition-colors">
          Commencer maintenant
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-green-500">
          <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Agriculteurs</h2>
          <p className="text-gray-600 mb-4">Vendez vos produits au meilleur prix et accédez aux prévisions météo locales.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-blue-500">
          <ShoppingBag className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Acheteurs</h2>
          <p className="text-gray-600 mb-4">Trouvez des produits frais locaux, contactez directement les producteurs.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-orange-500">
          <Truck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Transporteurs</h2>
          <p className="text-gray-600 mb-4">Consultez l'état des routes et trouvez des missions de transport près de chez vous.</p>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
