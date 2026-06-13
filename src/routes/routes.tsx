import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import NotificationsPage from '../components/common/Notification';   // Nouveau
import SettingsPage from '../components/common/Settings';             // Nouveau

// Pages Publiques
import Accueil from '../pages/public/Home';
import Prix from '../pages/common/Prix';
import Meteo from '../pages/common/Meteo';

// Agriculteur
import AgriculteurDashboard from '../pages/agriculteur/Dashboard';
import AgriculteurProduits from '../pages/agriculteur/Produits';
import AgriculteurVentes from '../pages/agriculteur/Ventes';
import AgriculteurSante from '../pages/agriculteur/SantePlantes';
import AgriculteurLocation from '../pages/agriculteur/Location';
import AgriculteurFinance from '../pages/agriculteur/Finance';

// Acheteur
import AcheteurDashboard from '../pages/acheteur/Dashboard';
import AcheteurRecherche from '../pages/acheteur/Recherche';
import AcheteurCommandes from '../pages/acheteur/Commandes';

// Transporteur
import TransporteurDashboard from '../pages/transporteur/Dashboard';
import TransporteurMissions from '../pages/transporteur/Missions';
import TransporteurTrajets from '../pages/transporteur/Trajets';
import TransporteurRoutes from '../pages/transporteur/EtatRoutes';

// Agent
import AgentDashboard from '../pages/agent/Dashboard';
import AgentAgriculteurs from '../pages/agent/Agriculteurs';
import AgentQualite from '../pages/agent/Qualite';

// Admin
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUtilisateurs from '../pages/admin/Utilisateurs';
import AdminStatistiques from '../pages/admin/Statistiques';
import AdminFinance from '../pages/admin/FinanceAdmin';

export const router = createBrowserRouter([
  // Routes publiques (avec MainLayout)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Accueil /> },
      { path: '/prix', element: <Prix /> },
      { path: '/meteo', element: <Meteo /> },
    ],
  },
  // Routes protégées (avec DashboardLayout)
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // === Routes transverses (accessibles à tous les rôles connectés) ===
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/settings', element: <SettingsPage /> },

      // === Agriculteur ===
      { path: '/agriculteur', element: <Navigate to="/agriculteur/dashboard" replace /> },
      { path: '/agriculteur/dashboard', element: <AgriculteurDashboard /> },
      { path: '/agriculteur/produits', element: <AgriculteurProduits /> },
      { path: '/agriculteur/ventes', element: <AgriculteurVentes /> },
      { path: '/agriculteur/sante', element: <AgriculteurSante /> },
      { path: '/agriculteur/location', element: <AgriculteurLocation /> },
      { path: '/agriculteur/finance', element: <AgriculteurFinance /> },

      // === Acheteur ===
      { path: '/acheteur', element: <Navigate to="/acheteur/dashboard" replace /> },
      { path: '/acheteur/dashboard', element: <AcheteurDashboard /> },
      { path: '/acheteur/recherche', element: <AcheteurRecherche /> },
      { path: '/acheteur/commandes', element: <AcheteurCommandes /> },

      // === Transporteur ===
      { path: '/transporteur', element: <Navigate to="/transporteur/dashboard" replace /> },
      { path: '/transporteur/dashboard', element: <TransporteurDashboard /> },
      { path: '/transporteur/missions', element: <TransporteurMissions /> },
      { path: '/transporteur/trajets', element: <TransporteurTrajets /> },
      { path: '/transporteur/routes', element: <TransporteurRoutes /> },

      // === Agent ===
      { path: '/agent', element: <Navigate to="/agent/dashboard" replace /> },
      { path: '/agent/dashboard', element: <AgentDashboard /> },
      { path: '/agent/agriculteurs', element: <AgentAgriculteurs /> },
      { path: '/agent/qualite', element: <AgentQualite /> },

      // === Admin ===
      { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/utilisateurs', element: <AdminUtilisateurs /> },
      { path: '/admin/statistiques', element: <AdminStatistiques /> },
      { path: '/admin/finance', element: <AdminFinance /> },
    ],
  },
]);