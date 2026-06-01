export interface AgentFollowup {
  id: string;
  agentId: string;               // Utilisateur avec rôle 'agent'
  agriculteurId: string;         // Utilisateur avec rôle 'agriculteur'
  dateDebut: Date;
  dateFin?: Date;                // Si l'agent ne suit plus
  notes?: string;
}