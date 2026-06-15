import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

// Types correspondant à la table loans
interface Loan {
  id: string;
  amount: number;
  duration_months: number;
  interest_rate: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPAID';
  farmer_id: string;
  farmer_name?: string; // populate depuis users
  farmer_phone?: string;
  created_at: string;
}

interface FormattedLoan {
  id: string;
  demandeId: string;
  demandeur: string;
  montant: string;
  duree: string;
  objet: string;
  statut: string;
  rawStatus: Loan['status'];
}

const FinanceAdmin: React.FC = () => {
  const [demandes, setDemandes] = useState<FormattedLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer tous les prêts (ou filtrer par status si besoin)
      const response = await api.get<Loan[]>('/loans');
      const formatted = response.data.map((loan) => ({
        id: loan.id,
        demandeId: `#PRT-${loan.id.slice(0, 4).toUpperCase()}`,
        demandeur: loan.farmer_name || `Agriculteur ${loan.farmer_id.slice(0, 6)}`,
        montant: loan.amount.toLocaleString('fr-MG') + ' Ar',
        duree: `${loan.duration_months} Mois`,
        objet: loan.purpose,
        statut: loan.status === 'PENDING' ? 'En attente' 
               : loan.status === 'APPROVED' ? 'Validé' 
               : loan.status === 'REJECTED' ? 'Refusé' 
               : 'Remboursé',
        rawStatus: loan.status,
      }));
      setDemandes(formatted);
    } catch (err) {
      console.error('Erreur chargement prêts:', err);
      setError('Impossible de charger les demandes de prêt.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (loanId: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(loanId);
    try {
      await api.patch(`/loans/${loanId}/status`, { status: action });
      // Rafraîchir la liste
      await fetchLoans();
    } catch (err) {
      console.error(`Erreur lors de la ${action === 'APPROVED' ? 'validation' : 'réjection'}:`, err);
      alert(`Erreur lors de la ${action === 'APPROVED' ? 'validation' : 'réjection'} du prêt.`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDemandes = demandes.filter(
    (d) =>
      d.demandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.demandeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.objet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white flex items-center gap-3">
            <Wallet className="text-green-400" size={32} />
            Gestion des Microcrédits
          </h2>
          <p className="text-white/60 mt-1">Validez et suivez les financements des agriculteurs.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-green-400 transition"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">Demande & Objet</th>
                <th className="p-4 font-medium">Demandeur</th>
                <th className="p-4 font-medium">Montant & Durée</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">
                    <Loader2 className="animate-spin inline-block mr-2" size={20} />
                    Chargement des demandes...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-400">
                    {error}
                    <button onClick={fetchLoans} className="ml-3 underline">Réessayer</button>
                  </td>
                </tr>
              ) : filteredDemandes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">
                    Aucune demande de prêt trouvée.
                  </td>
                </tr>
              ) : (
                filteredDemandes.map((demande) => (
                  <tr key={demande.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4">
                      <p className="font-bold text-white">{demande.demandeId}</p>
                      <p className="text-white/50 text-xs mt-1">{demande.objet}</p>
                    </td>
                    <td className="p-4 text-white/80">{demande.demandeur}</td>
                    <td className="p-4">
                      <p className="font-bold text-green-400">{demande.montant}</p>
                      <p className="text-white/50 text-xs mt-1">{demande.duree}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          demande.rawStatus === 'APPROVED'
                            ? 'bg-green-400/20 text-green-400'
                            : demande.rawStatus === 'REJECTED'
                            ? 'bg-red-400/20 text-red-400'
                            : demande.rawStatus === 'PENDING'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-blue-400/20 text-blue-400'
                        }`}
                      >
                        {demande.statut}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      {demande.rawStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(demande.id, 'APPROVED')}
                            disabled={processingId === demande.id}
                            className="p-2 bg-green-400/10 hover:bg-green-400/30 rounded-lg text-green-400 transition disabled:opacity-50"
                            title="Valider"
                          >
                            {processingId === demande.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleAction(demande.id, 'REJECTED')}
                            disabled={processingId === demande.id}
                            className="p-2 bg-red-400/10 hover:bg-red-400/30 rounded-lg text-red-400 transition disabled:opacity-50"
                            title="Refuser"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceAdmin;