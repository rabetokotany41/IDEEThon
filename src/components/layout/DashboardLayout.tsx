import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Menu, X, LogOut, Home, Sprout, ShoppingCart, Truck, Users, 
  Settings, BarChart, Map, ShieldCheck, Box, Search,
  Leaf, Wrench, Wallet, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Agricol1 from '../../assets/images/agricol1.jpeg';

const getNavLinks = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'agriculteur':
      return [
        { title: 'Vue d\'ensemble', path: '/agriculteur/dashboard', icon: <Home size={20} /> },
        { title: 'Mes Produits', path: '/agriculteur/produits', icon: <Sprout size={20} /> },
        { title: 'Mes Ventes', path: '/agriculteur/ventes', icon: <ShoppingCart size={20} /> },
        { title: 'IA Diagnostics', path: '/agriculteur/sante', icon: <Leaf size={20} /> },
        { title: 'Location Matériel', path: '/agriculteur/location', icon: <Wrench size={20} /> },
        { title: 'Microcrédit', path: '/agriculteur/finance', icon: <Wallet size={20} /> },
      ];
    case 'acheteur':
      return [
        { title: 'Vue d\'ensemble', path: '/acheteur/dashboard', icon: <Home size={20} /> },
        { title: 'Recherche', path: '/acheteur/recherche', icon: <Search size={20} /> },
        { title: 'Mes Commandes', path: '/acheteur/commandes', icon: <Box size={20} /> },
      ];
    case 'transporteur':
      return [
        { title: 'Vue d\'ensemble', path: '/transporteur/dashboard', icon: <Home size={20} /> },
        { title: 'Missions', path: '/transporteur/missions', icon: <Map size={20} /> },
        { title: 'Mes Trajets', path: '/transporteur/trajets', icon: <Truck size={20} /> },
        { title: 'État des Routes', path: '/transporteur/routes', icon: <AlertTriangle size={20} /> },
      ];
    case 'agent':
      return [
        { title: 'Vue d\'ensemble', path: '/agent/dashboard', icon: <Home size={20} /> },
        { title: 'Agriculteurs', path: '/agent/agriculteurs', icon: <Users size={20} /> },
        { title: 'Contrôle Qualité', path: '/agent/qualite', icon: <ShieldCheck size={20} /> },
      ];
    case 'admin':
      return [
        { title: 'Vue d\'ensemble', path: '/admin/dashboard', icon: <Home size={20} /> },
        { title: 'Utilisateurs', path: '/admin/utilisateurs', icon: <Users size={20} /> },
        { title: 'Statistiques', path: '/admin/statistiques', icon: <BarChart size={20} /> },
        { title: 'Microcrédits', path: '/admin/finance', icon: <Wallet size={20} /> },
      ];
    default:
      return [];
  }
};

import InteractiveBackground from '../common/InteractiveBackground';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sécurité: Si pas d'utilisateur, rediriger vers l'accueil
  if (!user) {
    navigate('/');
    return null;
  }

  const links = getNavLinks(user.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex overflow-hidden font-sans relative">
      {/* Image de fond identique à l'accueil */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={Agricol1}
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <InteractiveBackground />
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />
      
      {/* OVERLAY MOBILE */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white/5 backdrop-blur-md border-r border-white/10 z-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/" className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Sprout className="text-green-400" />
            AgriConnect
          </Link>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* PROFIL SHORTCUT */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-400/20 text-green-400 flex items-center justify-center font-bold text-lg border border-green-400/30">
              {user.displayName?.charAt(0) || user.role.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[140px]">{user.displayName || user.phone}</p>
              <p className="text-xs text-green-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30 font-semibold shadow-[0_0_15px_rgba(74,222,128,0.1)]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.icon}
                <span className="text-sm">{link.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold capitalize text-white/90">Espace {user.role}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition border border-white/10 text-white/70 hover:text-white">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
