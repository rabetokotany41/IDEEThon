export type NotificationType = 'prix' | 'offre' | 'meteo' | 'route' | 'systeme' | 'microcredit';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: {                      // Données additionnelles pour navigation
    offreId?: string;
    prixId?: string;
    routeId?: string;
    meteoAlerte?: string;
    creditId?: string;
  };
  isRead: boolean;
  createdAt: Date;
  sentViaPush?: boolean;         // Notification push envoyée ?
  syncStatus?: 'pending' | 'synced';
}