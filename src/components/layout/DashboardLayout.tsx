import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/icons/logo.png';
import {
  Menu, LogOut, Home, Sprout, ShoppingCart, Truck, Users,
  Settings, BarChart, Map, ShieldCheck, Box, Search,
  Leaf, Wrench, Wallet, AlertTriangle, Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Agricol1 from '../../assets/images/agricol1.jpeg';
import InteractiveBackground from '../common/InteractiveBackground';

interface User { role: string; displayName?: string; phone?: string; }
interface RoleConfigItem { label: string; accent: string; accentText: string; accentBg: string; accentBorder: string; }
type RoleConfigMap = Record<string, RoleConfigItem>;

const roleConfig: RoleConfigMap = {
  agriculteur: { label: 'Agriculteur', accent: '#4ade80', accentText: 'text-emerald-400', accentBg: 'bg-emerald-400/15', accentBorder: 'border-emerald-400/25' },
  acheteur: { label: 'Acheteur', accent: '#60a5fa', accentText: 'text-blue-400', accentBg: 'bg-blue-400/15', accentBorder: 'border-blue-400/25' },
  transporteur: { label: 'Transporteur', accent: '#fb923c', accentText: 'text-orange-400', accentBg: 'bg-orange-400/15', accentBorder: 'border-orange-400/25' },
  agent: { label: 'Agent', accent: '#22d3ee', accentText: 'text-cyan-400', accentBg: 'bg-cyan-400/15', accentBorder: 'border-cyan-400/25' },
  admin: { label: 'Admin', accent: '#a78bfa', accentText: 'text-violet-400', accentBg: 'bg-violet-400/15', accentBorder: 'border-violet-400/25' },
  superadmin: { label: 'Super Admin', accent: '#a78bfa', accentText: 'text-violet-400', accentBg: 'bg-violet-400/15', accentBorder: 'border-violet-400/25' },
};

const getNavLinks = (role: string) => {
  const normalizedRole = role?.toLowerCase() || '';
  switch (normalizedRole) {
    case 'agriculteur':
      return [
        { title: "Vue d'ensemble", path: '/agriculteur/dashboard', icon: Home },
        { title: 'Mes Produits', path: '/agriculteur/produits', icon: Sprout },
        { title: 'Mes Ventes', path: '/agriculteur/ventes', icon: ShoppingCart },
        { title: 'IA Diagnostics', path: '/agriculteur/sante', icon: Leaf },
        { title: 'Location Matériel', path: '/agriculteur/location', icon: Wrench },
        { title: 'Microcrédit', path: '/agriculteur/finance', icon: Wallet },
      ];
    case 'acheteur':
      return [
        { title: "Vue d'ensemble", path: '/acheteur/dashboard', icon: Home },
        { title: 'Recherche', path: '/acheteur/recherche', icon: Search },
        { title: 'Mes Commandes', path: '/acheteur/commandes', icon: Box },
      ];
    case 'transporteur':
      return [
        { title: "Vue d'ensemble", path: '/transporteur/dashboard', icon: Home },
        { title: 'Missions', path: '/transporteur/missions', icon: Map },
        { title: 'Mes Trajets', path: '/transporteur/trajets', icon: Truck },
        { title: "État des Routes", path: '/transporteur/routes', icon: AlertTriangle },
      ];
    case 'agent':
      return [
        { title: "Vue d'ensemble", path: '/agent/dashboard', icon: Home },
        { title: 'Agriculteurs', path: '/agent/agriculteurs', icon: Users },
        { title: 'Contrôle Qualité', path: '/agent/qualite', icon: ShieldCheck },
      ];
    case 'admin':
    case 'superadmin':
      return [
        { title: "Vue d'ensemble", path: '/admin/dashboard', icon: Home },
        { title: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users },
        { title: 'Statistiques', path: '/admin/statistiques', icon: BarChart },
        { title: 'Microcrédits', path: '/admin/finance', icon: Wallet },
      ];
    default:
      return [];
  }
};

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  const links = getNavLinks(user.role);
  const config = roleConfig[user.role] ?? roleConfig.admin;
  const displayName = user.displayName || user.phone || 'Utilisateur';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex font-sans relative" style={{ background: '#0b0c14' }}>
      {/* Arrière-plan fixe */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={Agricol1} className="w-full h-full object-cover opacity-25" style={{ filter: 'blur(2px)' }} alt="Background" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(11,12,20,0.92) 0%,rgba(11,12,20,0.80) 100%)' }} />
      </div>
      <InteractiveBackground />

      {/* Overlay mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ========== SIDEBAR (mobile & desktop réduit) ========== */}
      <motion.aside
        className={`fixed top-1/3 left-4 z-50 flex flex-col w-64 md:w-20 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden
        `}
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center justify-center border-b border-white/10">
          <Link to="#" onClick={handleLinkClick}>
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${config.accentBg}`}
            >
              <img src={Logo} alt="logo" />
            </div>
          </Link>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-6 gap-2">
          <div
            className={` w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm border border-white/20 shadow-lg
        ${config.accentBg}
        ${config.accentText}
      `}
          >
            {initials}
          </div>

          <span className="hidden md:block text-[11px] text-white/60 text-center">
            {config.label}
          </span>
        </div>

        {/* Menu principal */}
        <div className="flex-1 flex flex-col items-center gap-3 py-4">
          {/* Tes liens ici */}
        </div>

        {/* Notifications / Paramètres */}
        <div className="flex flex-col items-center gap-3 py-4 border-t border-white/10">
          <Link to="/notifications" className="cursor-pointer relative w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Bell size={18} className="text-white/60" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link to="/settings" className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <Settings size={18} className="text-white/60" />
          </Link>
        </div>

        {/* Déconnexion */}
        <div className="p-4 flex justify-center border-t border-white/10">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-12 h-12 rounded-2xl flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={22} />
          </button>
        </div>
      </motion.aside>

      {/* ========== MAIN ========== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
        {/* HEADER */}
        <header
          className=" fixed left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-[72px] px-4 md:px-8 flex items-center justify-between rounded-2xl z-50
          "
        >
          {/* Menu mobile */}
          <button
            className="cursor-pointer md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Espace vide desktop */}
          <div className="hidden md:block w-10" />

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-2 px-4 py-1 rounded-full border border-green-500/30 bg-black/40 backdrop-blur-xl">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={` flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
            ${isActive
                      ? "bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                      : "text-white/70 hover:text-green-400 hover:bg-green-500/10"
                    }
          `}
                  style={
                    isActive
                      ? { border: "1px solid rgba(34,197,94,0.4)" }
                      : {}
                  }
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Profil utilisateur */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className=" hidden md:flex items-center gap-3 px-3 h-11 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-green-400/30 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="hidden lg:block text-right">
                <p className="text-white text-sm font-semibold group-hover:text-green-300 transition-colors">
                  {displayName}
                </p>
                <p className="text-white/40 text-xs">
                  {config.label}
                </p>
              </div>

              <div
                className=" relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-green-500/20 text-green-400 border border-white/40 shadow-lg group-hover:scale-110 transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-green-400/20 blur-md animate-pulse"></span>

                <span className="relative z-10">
                  {initials}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7 mb-4 mt-[72px]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;