export type MaterielStatus = 'disponible' | 'loue' | 'en_maintenance';

export interface AnnonceMateriel {
  id: string;
  userId: string;                 // Propriétaire du matériel
  type: string;                   // "motoculteur", "charrue", "pompe", "tracteur"
  marque?: string;
  description: string;
  prixParJourAr: number;
  disponibleDu: Date;
  disponibleAu: Date;
  localisation: string;           // Description texte
  coordonnees?: { lat: number; lng: number };
  photos?: string[];
  status: MaterielStatus;
  createdAt: Date;
  updatedAt: Date;
  syncStatus?: 'pending' | 'synced';
}

export interface ReservationMateriel {
  id: string;
  annonceId: string;
  emprunteurId: string;           // agriculteur qui loue
  dateDebut: Date;
  dateFin: Date;
  statut: 'en_attente' | 'confirmee' | 'terminee' | 'annulee';
  montantTotalAr: number;
  createdAt: Date;
}