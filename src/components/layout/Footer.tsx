import React from 'react';
export const Footer: React.FC = () => {
  return (
    <footer className="bg-earth-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-bold mb-2">AgriConnect Madagascar</h4>
          <p>Connecter les agriculteurs aux acheteurs, même sans internet.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Liens utiles</h4>
          <ul className="space-y-1">
            <li><a href="/apropos" className="hover:text-primary-300">À propos</a></li>
            <li><a href="/contact" className="hover:text-primary-300">Contact</a></li>
            <li><a href="/faq" className="hover:text-primary-300">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Télécharger l'application</h4>
          <button className="bg-primary-600 px-3 py-1 rounded text-sm">Installer la PWA</button>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-4">© 2025 AgriConnect Madagascar – Tous droits réservés</div>
    </footer>
  );
};