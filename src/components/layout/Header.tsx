import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOffline } from '../../hooks/useOffline';
import colors from '../../components/common/color';
import {
  Menu, X, WifiOff, Wifi, RefreshCw, User, Leaf,
  LayoutDashboard, ShoppingBag, Truck, Users, Shield, Settings
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { isOnline, syncPending, forceSync } = useOffline();
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation items par rôle
  const navItems: Record<string, { name: string; path: string; icon: any }[]> = {
    agriculteur: [
      { name: 'Tableau de bord', path: '/agriculteur/dashboard', icon: LayoutDashboard },
      { name: 'Mes offres', path: '/agriculteur/offres', icon: Leaf },
      { name: 'Prix & Météo', path: '/agriculteur/prix', icon: ShoppingBag },
      { name: 'Routes', path: '/carte-routes', icon: Truck },
    ],
    acheteur: [
      { name: 'Achats', path: '/acheteur/recherche', icon: ShoppingBag },
      { name: 'Collectes', path: '/acheteur/collectes', icon: Leaf },
      { name: 'Prix', path: '/prix', icon: ShoppingBag },
      { name: 'Routes', path: '/carte-routes', icon: Truck },
    ],
    transporteur: [
      { name: 'Missions', path: '/transporteur/missions', icon: Truck },
      { name: 'Routes', path: '/carte-routes', icon: Truck },
      { name: 'Météo trajet', path: '/meteo', icon: LayoutDashboard },
    ],
    agent: [
      { name: 'Agriculteurs', path: '/agent/agriculteurs', icon: Users },
      { name: 'Saisie prix', path: '/agent/prix', icon: ShoppingBag },
      { name: 'Synchro', path: '/agent/sync', icon: RefreshCw },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Utilisateurs', path: '/admin/users', icon: Users },
      { name: 'Modération', path: '/admin/offres', icon: Shield },
    ],
    superadmin: [
      { name: 'Serveur', path: '/superadmin/serveur', icon: Settings },
      { name: 'Admin', path: '/superadmin/admins', icon: Shield },
    ],
  };

  const currentNav = role ? navItems[role] || [] : [];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: colors.primary }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + nom */}
        <Link to="/" className="flex items-center space-x-2 text-white">
          <Leaf size={28} className="text-white" />
          <span className="font-bold text-xl tracking-tight">AgriConnect</span>
          <span className="text-xs bg-yellow-600 px-1 rounded">Mada</span>
        </Link>

        {/* Indicateur réseau + synchro (toujours visible) */}
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <div title="En ligne"><Wifi size={18} className="text-green-200" /></div>
          ) : (
            <div title="Hors ligne - données locales"><WifiOff size={18} className="text-orange-200" /></div>
          )}
          {syncPending > 0 && (
            <button
              onClick={forceSync}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center"
              title={`${syncPending} synchronisation(s) en attente`}
            >
              <RefreshCw size={14} className="mr-1 animate-spin-slow" />
              {syncPending}
            </button>
          )}
        </div>

        {/* Desktop navigation (visible > 768px) */}
        <nav className="hidden md:flex items-center space-x-4">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              <item.icon size={16} className="inline mr-1" />
              {item.name}
            </Link>
          ))}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 bg-green-700 rounded-full px-3 py-1">
                <User size={16} className="text-white" />
                <span className="text-white text-sm truncate max-w-[100px]">{user.displayName || user.phone}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon profil</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Déconnexion</button>
              </div>
            </div>
          ) : (
            <Link to="/connexion" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">Se connectesr</Link>
          )}
        </nav>

        {/* Bouton menu mobile */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 py-4 px-4 border-t border-green-700">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-2 text-white hover:bg-green-700 rounded-md px-2"
              onClick={() => setMenuOpen(false)}
            >
              <item.icon size={18} className="inline mr-2" />
              {item.name}
            </Link>
          ))}
          <hr className="my-2 border-green-600" />
          {user ? (
            <>
              <Link to="/profile" className="block py-2 text-white hover:bg-green-700 rounded-md px-2" onClick={() => setMenuOpen(false)}>Mon profil</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left py-2 text-white hover:bg-green-700 rounded-md px-2">Déconnexion</button>
            </>
          ) : (
            <Link to="/connexion" className="block py-2 text-white bg-orange-600 text-center rounded-md mt-2" onClick={() => setMenuOpen(false)}>Se connecter</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;