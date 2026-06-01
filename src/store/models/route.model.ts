export type RouteEtat = 'bonne' | 'degradee' | 'impraticable';

export interface SignalementRoute {
  id: string;
  userId: string;                 // Personne qui signale
  location: {
    lat: number;
    lng: number;
  };
  etat: RouteEtat;
  photoUrl?: string;
  comment?: string;
  createdAt: Date;
  validatedByAdmin?: boolean;     // Validation pour éviter les faux signalements
  adminValidationDate?: Date;
  syncStatus?: 'pending' | 'synced';
}