export type UserRole = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent' | 'admin';

export interface User {
  id: string;                     // UID Firestore ou UUID
  phone: string;                  // Numéro de téléphone (unique)
  name?: string;                  // Nom affiché
  role: UserRole;
  region: string;                 // Ex: "Analamanga"
  village?: string;               // Commune / fokontany
  avatarUrl?: string;             // Photo de profil (optionnelle)
  fcmToken?: string;              // Token Firebase Cloud Messaging (notifications push)
  isActive: boolean;              // Compte actif / désactivé par admin
  createdAt: Date;
  lastLoginAt?: Date;
  lastSyncAt?: Date;              // Dernière synchronisation réussie (offline)
  preferences?: {
    language: 'mg' | 'fr';        // Malgache ou français
    notificationsEnabled: boolean;
    lowDataMode: boolean;         // Mode économie de données
  };
}