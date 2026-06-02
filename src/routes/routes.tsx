import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Pages Publiques
import Accueil from '../pages/public/Accueil';
import Connexion from '../pages/public/Connexion';

// Pages Communes
import Prix from '../pages/common/Prix';
import Meteo from '../pages/common/Meteo';
import CarteRoutes from '../pages/common/CarteRoutes';

// Pages par Rôle (Agriculteur)
import DashboardAgriculteur from '../pages/agriculteur/DashboardAgriculteur';
import PublierOffre from '../pages/agriculteur/PublierOffre';

// Pages par Rôle (Acheteur)
import DashboardAcheteur from '../pages/acheteur/DashboardAcheteur';

// Pages par Rôle (Agent)
import InterfaceAgent from '../pages/agent/InterfaceAgent';

// Pages par Rôle (Admin)
import DashboardAdmin from '../pages/admin/DashboardAdmin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Accueil /> },
      { path: '/connexion', element: <Connexion /> },
      
      // Pages Communes
      { path: '/prix', element: <Prix /> },
      { path: '/meteo', element: <Meteo /> },
      { path: '/carte-routes', element: <CarteRoutes /> },
      
      // Agriculteur
      { path: '/agriculteur/dashboard', element: <DashboardAgriculteur /> },
      { path: '/agriculteur/publier-offre', element: <PublierOffre /> },
      
      // Acheteur
      { path: '/acheteur/recherche', element: <DashboardAcheteur /> },
      
      // Agent
      { path: '/agent/agriculteurs', element: <InterfaceAgent /> },
      
      // Admin
      { path: '/admin', element: <DashboardAdmin /> },
    ]
  }
]);
