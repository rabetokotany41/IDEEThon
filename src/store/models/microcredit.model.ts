export type CreditStatus = 'demande' | 'approuve' | 'rembourse' | 'rejete';

export interface DemandeMicrocredit {
  id: string;
  userId: string;                 // agriculteur
  montantDemandeAr: number;
  dureeMois: number;              // 3, 6, 12 mois
  raison: string;                 // Ex: "achat semences"
  justificatifUrl?: string;       // Photo de la parcelle ou justificatif
  statut: CreditStatus;
  montantAccordeAr?: number;
  tauxInteretPercent?: number;
  dateAccord?: Date;
  echeances?: EcheanceRemboursement[];
  createdAt: Date;
  updatedAt: Date;
  syncStatus?: 'pending' | 'synced';
}

export interface EcheanceRemboursement {
  date: Date;
  montantAr: number;
  paye: boolean;
  datePaiement?: Date;
}