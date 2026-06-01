import { createBrowserRouter } from 'react-router-dom';

// Pages Publiques
import { Accueil } from '../pages/public/Accueil';
import { Connexion } from '../pages/public/Connexion';
import { Inscription } from '../pages/public/Inscription';
import { APropos } from '../pages/public/APropos';
import { MentionsLegales } from '../pages/public/MentionsLegales';
import { Aide } from '../pages/public/Aide';
import { Telechargement } from '../pages/public/Telechargement';

// Dashboards
import { AgriculteurDashboard } from '../pages/agriculteur/AgriculteurDashboard';
import { AcheteurDashboard } from '../pages/acheteur/AcheteurDashboard';
import { TransporteurDashboard } from '../pages/transporteur/TransporteurDashboard';
import { AgentRelaisDashboard } from '../pages/agent/AgentRelaisDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';

// Routeur temporaire pour afficher les dashboards selon le rôle (Simulation)
import { useAuth } from '../hooks/useAuth';

const DashboardRouter = () => {
  const { user } = useAuth();
  
  // Dans un vrai projet, on redirigerait vers /connexion
  const role = user?.role || 'agriculteur';

  switch (role) {
    case 'agriculteur': return <AgriculteurDashboard />;
    case 'acheteur': return <AcheteurDashboard />;
    case 'transporteur': return <TransporteurDashboard />;
    case 'agent': return <AgentRelaisDashboard />;
    case 'admin': return <AdminDashboard />;
    case 'superadmin': return <SuperAdminDashboard />;
    default: return <AgriculteurDashboard />;
  }
};

export const router = createBrowserRouter([
  { path: '/', element: <Accueil /> },
  { path: '/connexion', element: <Connexion /> },
  { path: '/inscription', element: <Inscription /> },
  { path: '/a-propos', element: <APropos /> },
  { path: '/mentions-legales', element: <MentionsLegales /> },
  { path: '/aide', element: <Aide /> },
  { path: '/telechargement', element: <Telechargement /> },
  
  // Routes de démo directes pour faciliter la visualisation
  { path: '/dashboard', element: <DashboardRouter /> },
  { path: '/dashboard/agriculteur', element: <AgriculteurDashboard /> },
  { path: '/dashboard/acheteur', element: <AcheteurDashboard /> },
  { path: '/dashboard/transporteur', element: <TransporteurDashboard /> },
  { path: '/dashboard/agent', element: <AgentRelaisDashboard /> },
  { path: '/dashboard/admin', element: <AdminDashboard /> },
  { path: '/dashboard/superadmin', element: <SuperAdminDashboard /> },
]);
