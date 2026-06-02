export interface AgentFollowup {
  id: string;
  agentId: string;
  agriculteurId: string;
  dateDebut: Date;
  dateFin?: Date;
  notes?: string;
}