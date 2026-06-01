export type SyncAction = 'create' | 'update' | 'delete';
export type SyncCollection = 'offres' | 'prix' | 'routes' | 'microcredits' | 'notifications' | 'materiel';

export interface SyncQueueItem {
  id: string;                    // Identifiant unique local (auto-incrément ou UUID)
  collection: SyncCollection;
  action: SyncAction;
  documentId: string;            // ID du document concerné (côté serveur si connu)
  data: any;                     // Copie complète de l'objet à envoyer
  retryCount: number;            // Nombre de tentatives échouées
  lastRetryAt?: Date;
  createdAt: Date;
  syncedAt?: Date;               // Date de réussite
}