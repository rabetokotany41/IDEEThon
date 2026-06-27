import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

interface Loan {
  id: string;
  amount: number;
  remaining_amount: number;
  duration_months: number;
  monthly_payment: number;
  interest_rate: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'rejected';
  purpose: string;
  created_at: string;
  next_due_date?: string;
  paid_installments: number;
  total_installments: number;
}

const Finance: React.FC = () => {
  const { user } = useAuth();
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulaire de demande
  const [montant, setMontant] = useState(500000);
  const [duree, setDuree] = useState(6);
  const [purpose, setPurpose] = useState('Achat semences');

  // Taux d'intérêt (à récupérer depuis backend ou fixe)
  const interestRate = 0.02; // 2% par mois

  // Calculs
  const interetTotal = montant * interestRate * duree;
  const totalRemboursement = montant + interetTotal;
  const mensualite = totalRemboursement / duree;

  // Récupérer les prêts actifs
  useEffect(() => {
    if (!user) return;
    const fetchLoans = async () => {
      try {
        const response = await api.get(`/loans/farmer/${user.id}`);
        // Filtrer les prêts actifs ou en attente
        const active = response.data.filter((loan: Loan) => 
          loan.status === 'active' || loan.status === 'approved' || loan.status === 'pending' || (loan.status as string) === 'PENDING'
        );
        setActiveLoans(active);
      } catch (err) {
        console.error('Erreur chargement prêts:', err);
        setError('Impossible de charger vos prêts');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [user]);

  // Soumettre une demande de prêt
  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        amount: montant,
        duration_months: duree,
        purpose: purpose,
        farmerId: user.id,
        interest_rate: interestRate
      };
      await api.post('/loans', payload);
      setRequested(true);
      // Optionnel: recharger les prêts après un délai
      setTimeout(() => {
        // Rafraîchir la liste des prêts
        const fetchLoans = async () => {
          const response = await api.get(`/loans/farmer/${user.id}`);
          const active = response.data.filter((loan: Loan) => 
            loan.status === 'active' || loan.status === 'approved' || loan.status === 'pending' || (loan.status as string) === 'PENDING'
          );
          setActiveLoans(active);
        };
        fetchLoans();
      }, 2000);
    } catch (err: any) {
      console.error('Erreur soumission:', err);
      setError(err.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  // Payer une mensualité
  const handlePayInstallment = async (loanId: string) => {
    try {
      // Endpoint à adapter selon votre backend
      await api.patch(`/loans/${loanId}/pay`, {});
      // Recharger les prêts
      const response = await api.get(`/loans/farmer/${user?.id || (user as any)?.sub}`);
      const active = response.data.filter((loan: Loan) => 
        loan.status === 'active' || loan.status === 'approved' || loan.status === 'pending'
      );
      setActiveLoans(active);
      // Afficher un message de succès (toast)
    } catch (err) {
      console.error('Erreur paiement:', err);
      alert('Le paiement a échoué. Réessayez.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white flex items-center gap-3">
          <Wallet className="text-green-400" size={32} />
          Microcrédit Agricole
        </h2>
        <p className="text-white/60 mt-1">Financez vos semences et votre matériel avec un taux préférentiel de 2%.</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SIMULATEUR & DEMANDE */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Simulateur de prêt</h3>

          {!requested ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-white mb-2">
                  <label className="text-sm text-white/70">Montant souhaité</label>
                  <span className="font-bold text-green-400">{montant.toLocaleString('fr-MG')} Ar</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="50000"
                  value={montant}
                  onChange={(e) => setMontant(Number(e.target.value))}
                  className="w-full accent-green-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>50 000 Ar</span>
                  <span>2 000 000 Ar</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-white mb-2">
                  <label className="text-sm text-white/70">Durée du prêt</label>
                  <span className="font-bold text-green-400">{duree} Mois</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full accent-green-400 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>1 Mois</span>
                  <span>12 Mois</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-2">Objet du prêt</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                >
                  <option value="Achat semences">Achat semences</option>
                  <option value="Achat engrais">Achat engrais</option>
                  <option value="Achat matériel">Achat matériel (outils, pompe)</option>
                  <option value="Irrigation">Système d'irrigation</option>
                  <option value="Transport">Frais de transport</option>
                </select>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 mt-6">
                <div className="flex justify-between">
                  <span className="text-white/60">Intérêts (2%/mois)</span>
                  <span className="text-white">{interetTotal.toLocaleString('fr-MG')} Ar</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/60">Total à rembourser</span>
                  <span className="text-white font-bold">{totalRemboursement.toLocaleString('fr-MG')} Ar</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-white font-bold">Mensualité estimée</span>
                  <span className="text-green-400 font-bold text-xl">{mensualite.toLocaleString('fr-MG', { maximumFractionDigits: 0 })} Ar</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition ${
                  submitting
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10'
                }`}
              >
                {submitting ? <Clock size={18} className="animate-spin" /> : <Wallet size={18} />}
                {submitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h4 className="text-white font-bold text-lg">Demande envoyée !</h4>
              <p className="text-white/50 text-sm mt-2">Votre dossier est en cours d'analyse par notre équipe.</p>
              <button
                onClick={() => setRequested(false)}
                className="mt-6 text-green-400 text-sm underline"
              >
        +         Refaire une simulation
              </button>
            </div>
          )}
        </div>

        {/* LISTE DES PRÊTS ACTIFS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Crédits en cours</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
            </div>
          ) : activeLoans.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Wallet size={48} className="mx-auto mb-3 opacity-30" />
              <p>Aucun prêt actif.</p>
              <p className="text-sm">Utilisez le simulateur pour faire une demande.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeLoans.map((loan) => {
                const paidInstallments = loan.paid_installments || 0;
                const totalInstallments = loan.total_installments || loan.duration_months || 1;
                const progress = (paidInstallments / totalInstallments) * 100;
                const monthlyPayment = loan.monthly_payment || ((loan.amount + (loan.amount * interestRate * loan.duration_months)) / totalInstallments);
                const remaining = loan.remaining_amount || (loan.amount + (loan.amount * interestRate * loan.duration_months) - (monthlyPayment * paidInstallments));
                return (
                  <div key={loan.id} className="bg-black/20 rounded-xl border border-white/5 p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                      <TrendingUp size={100} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="px-3 py-1 bg-blue-400/20 text-blue-400 text-xs font-bold rounded-full border border-blue-400/20">
                            {loan.purpose || 'Prêt agricole'}
                          </span>
                          <h4 className="font-bold text-white text-lg mt-2">Prêt N°{loan.id.slice(-6)}</h4>
                        </div>
                        <span className="text-white/50 text-sm">
                          {new Date(loan.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/60">
                              Remboursement ({loan.paid_installments}/{loan.total_installments} mois)
                            </span>
                            <span className="text-green-400 font-bold">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-green-400"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="text-white/40 text-xs">Reste à payer</p>
                            <p className="text-white font-bold">{remaining.toLocaleString('fr-MG')} Ar</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/40 text-xs">Mensualité</p>
                            <p className="text-yellow-400 font-bold">{monthlyPayment.toLocaleString('fr-MG')} Ar</p>
                          </div>
                        </div>
                        {loan.next_due_date && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/40">Prochaine échéance</span>
                            <span className="text-yellow-400 flex items-center gap-1">
                              <AlertCircle size={12} /> {new Date(loan.next_due_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handlePayInstallment(loan.id)}
                        className="cursor-pointer w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition border border-white/10 flex items-center justify-center gap-2"
                      >
                        Payer la mensualité <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Finance;