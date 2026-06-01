import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { NotificationBadge } from '../notifications/NotificationBadge';
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img src="/logo.png" alt="AgriConnect" className="h-8 w-8" />
          <span className="hidden sm:inline">AgriConnect Madagascar</span>
          <span className="sm:hidden">AgriConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/dashboard" className="hover:text-primary-200 transition">Accueil</Link>
          <Link to="/marche" className="hover:text-primary-200 transition">Marché</Link>
          <Link to="/meteo" className="hover:text-primary-200 transition">Météo</Link>
          <Link to="/routes" className="hover:text-primary-200 transition">Routes</Link>
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBadge />
              <div className="relative">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center gap-1">
                  <span className="hidden sm:inline">{user.name || user.phone}</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Mon profil</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Déconnexion</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="text-white border-white hover:bg-white hover:text-primary-700">
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};