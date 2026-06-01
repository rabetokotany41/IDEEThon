export type OffreStatus = 'active' | 'vendue' | 'expiree' | 'annulee';

export interface Offre {
  id: string;
  userId: string;                 // Référence à l'agriculteur ou agent qui publie
  product: string;                // Nom du produit (ex: "tomate")
  quantityKg: number;             // Quantité en kilogrammes
  unitPriceAr: number;            // Prix unitaire (Ariary par kg)
  totalPriceAr: number;           // Calculé = quantityKg * unitPriceAr
  location: {
    lat: number;
    lng: number;
    address: string;              // Description textuelle
  };
  availableUntil: Date;           // Date de fin de validité
  status: OffreStatus;
  images?: string[];              // URLs des photos (optionnel)
  createdAt: Date;
  updatedAt: Date;
  syncStatus?: 'pending' | 'synced' | 'failed';   // Pour offline
  syncError?: string;
}