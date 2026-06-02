import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Download, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';
import colors from '../../components/common/color';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = 'v2.1.0'; // À lire depuis package.json ou env

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Colonne 1 : Mission & logo */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Leaf size={24} className="text-green-400" />
            <span className="text-white font-bold text-lg">AgriConnect Madagascar</span>
          </div>
          <p className="text-sm">
            Mettre en relation directe producteurs et acheteurs, même sans connexion internet.
          </p>
          <p className="text-xs mt-2 text-gray-400">80% de la population agricole – 100% d'impact.</p>
        </div>

        {/* Colonne 2 : Liens utiles */}
        <div>
          <h4 className="text-white font-semibold mb-3">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-400 transition">Accueil</Link></li>
            <li><Link to="/comment-ca-marche" className="hover:text-green-400 transition">Comment ça marche ?</Link></li>
            <li><Link to="/telecharger" className="hover:text-green-400 transition flex items-center"><Download size={14} className="mr-1" /> Télécharger l'app (PWA)</Link></li>
            <li><Link to="/aide" className="hover:text-green-400 transition flex items-center"><HelpCircle size={14} className="mr-1" /> Aide & tutoriels offline</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact & support */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support terrain</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><Phone size={14} className="mr-2 text-green-400"/> +261 34 XX XXX XX (appel/SMS)</li>
            <li className="flex items-center"><Mail size={14} className="mr-2 text-green-400"/> support@agriconnect.mg</li>
            <li className="flex items-center"><MapPin size={14} className="mr-2 text-green-400"/> Antananarivo & zones rurales</li>
          </ul>
          <p className="text-xs mt-3 text-gray-500">Numéro d'urgence agricole : 321 (gratuit)</p>
        </div>

        {/* Colonne 4 : Légal & PWA */}
        <div>
          <h4 className="text-white font-semibold mb-3">Légal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/mentions-legales" className="hover:text-green-400 transition">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="hover:text-green-400 transition">Politique de confidentialité</Link></li>
            <li><Link to="/conditions" className="hover:text-green-400 transition">Conditions d'utilisation</Link></li>
          </ul>
          <div className="mt-4 pt-2 border-t border-gray-800 text-xs text-gray-500">
            <p>Version {appVersion} – mode offline actif</p>
            <p>© {currentYear} AgriConnect Madagascar</p>
          </div>
        </div>
      </div>

      {/* Bandeau bas : installation PWA si critères remplis */}
      <div className="text-center mt-8 pt-4 border-t border-gray-800 text-xs text-gray-500">
        <p>
          <span className="inline-block bg-gray-800 px-2 py-1 rounded">📱 Application utilisable sans internet après installation</span>
          &nbsp;–&nbsp;
          <a href="#" className="text-green-400 underline" onClick={() => {/* déclencher installation PWA */}}>Ajouter à l'écran d'accueil</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;