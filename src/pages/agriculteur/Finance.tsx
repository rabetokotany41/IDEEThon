import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const Finance: React.FC = () => {
  const [montant, setMontant] = useState(500000);
  const [duree, setDuree] = useState(6);
  const [requested, setRequested] = useState(false);

  // Simulation taux d'intérêt à 2% par mois
  const interetTotal = montant * 0.02 * duree;
  const totalRemboursement = montant + interetTotal;
  const mensualite = totalRemboursement / duree;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SIMULATOR */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Simulateur de prêt</h3>
          
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
                <span>50,000 Ar</span>
                <span>2,000,000 Ar</span>
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

            <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 mt-6">
              <div className="flex justify-between">
                <span className="text-white/60">Taux d'intérêt (2%/mois)</span>
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

            {!requested ? (
              <button 
                onClick={() => setRequested(true)}
                className="w-full py-4 mt-2 bg-green-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-green-500 transition-colors rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.3)]"
              >
                Soumettre le dossier
              </button>
            ) : (
              <div className="w-full py-4 mt-2 bg-green-400/20 border border-green-400/30 text-green-400 font-bold uppercase text-sm tracking-widest rounded-lg flex items-center justify-center gap-2">
                <Clock size={18} /> Demande en cours d'analyse
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE LOANS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Crédits en cours</h3>
          
          <div className="bg-black/20 rounded-xl border border-white/5 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <TrendingUp size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 bg-blue-400/20 text-blue-400 text-xs font-bold rounded-full border border-blue-400/20">
                    Achat Engrais
                  </span>
                  <h4 className="font-bold text-white text-lg mt-2">Prêt N°4092</h4>
                </div>
                <span className="text-white/50 text-sm">Validé le 01 Oct</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Remboursement (4/6 mois)</span>
                    <span className="text-green-400 font-bold">66%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '66%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-green-400"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Reste à payer</p>
                    <p className="text-white font-bold">110,000 Ar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Prochaine échéance</p>
                    <p className="text-yellow-400 font-bold flex items-center gap-1 justify-end">
                      <AlertCircle size={14} /> 01 Nov 2023
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition border border-white/10">
                Payer la mensualité (55,000 Ar)
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Finance;
