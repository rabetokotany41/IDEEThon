import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { type UserRole } from '../../hooks/useAuth';
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: '📊', roles: ['agriculteur', 'acheteur', 'transporteur', 'agent', 'admin', 'superadmin'] },
  { name: 'Mes offres', path: '/offres', icon: '🌾', roles: ['agriculteur', 'agent'] },
  { name: 'Publier une offre', path: '/offres/nouvelle', icon: '➕', roles: ['agriculteur', 'agent'] },
  { name: 'Rechercher des produits', path: '/recherche', icon: '🔍', roles: ['acheteur'] },
  { name: 'Carte des routes', path: '/routes', icon: '🗺️', roles: ['agriculteur', 'acheteur', 'transporteur', 'agent'] },
  { name: 'Météo', path: '/meteo', icon: '☀️', roles: ['agriculteur', 'acheteur', 'transporteur', 'agent'] },
  { name: 'Location matériel', path: '/materiel', icon: '🚜', roles: ['agriculteur', 'transporteur'] },
  { name: 'Microcrédit', path: '/microcredit', icon: '💰', roles: ['agriculteur'] },
  { name: 'Gestion utilisateurs', path: '/admin/users', icon: '👥', roles: ['admin', 'superadmin'] },
  { name: 'Console serveur', path: '/superadmin/server', icon: '⚙️', roles: ['superadmin'] },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const allowedItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-1">
        {allowedItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};