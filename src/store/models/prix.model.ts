export interface PrixMarche {
  id: string;
  product: string;
  region: string;
  priceAr: number;                // Prix en Ariary par kg (ou par unité selon produit)
  unit: 'kg' | 'piece' | 'botte'; // Unité de mesure
  source: 'agent' | 'admin' | 'auto'; // Origine de la donnée
  reportedBy?: string;            // userId de l'agent ou admin
  reportedAt: Date;
  verifiedAt?: Date;              // Date de validation par un admin
  syncStatus?: 'pending' | 'synced';
}