import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Upload, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const SantePlantes: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'success'>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult('success');
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Diagnostic IA des Plantes</h2>
        <p className="text-white/60 mt-1">Prenez une photo de votre culture pour détecter une maladie</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* UPLOAD SECTION */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          {!analyzing && !result ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center text-green-400 mb-4 cursor-pointer hover:bg-green-400/20 transition">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Importer une photo</h3>
              <p className="text-white/50 text-sm mt-2 mb-6 max-w-sm">Assurez-vous que la zone malade (feuille, tige, fruit) soit bien visible et éclairée.</p>
              <button 
                onClick={handleAnalyze}
                className="px-6 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 transition shadow-[0_0_15px_rgba(74,222,128,0.3)]"
              >
                Lancer le diagnostic
              </button>
            </div>
          ) : analyzing ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-white">L'IA analyse votre photo...</h3>
              <p className="text-white/50 text-sm mt-2">Recherche de plus de 150 maladies connues.</p>
            </div>
          ) : (
            <div className="w-full text-left w-full">
              <div className="flex items-center gap-3 text-red-400 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-xl font-bold">Maladie détectée : Mildiou de la Tomate</h3>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6 space-y-2 text-sm text-white/80">
                <p><strong>Certitude IA :</strong> <span className="text-green-400">89%</span></p>
                <p><strong>Cause :</strong> Champignon Phytophthora infestans, souvent dû à l'humidité prolongée.</p>
              </div>
              <h4 className="font-bold text-white mb-2">Traitements recommandés :</h4>
              <ul className="list-disc pl-5 text-white/70 text-sm space-y-1 mb-6">
                <li>Retirer immédiatement les feuilles touchées.</li>
                <li>Appliquer un fongicide à base de cuivre (Bouillie bordelaise).</li>
                <li>Espacer les plants pour améliorer l'aération.</li>
              </ul>
              <button 
                onClick={() => setResult(null)}
                className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition"
              >
                Analyser une autre photo
              </button>
            </div>
          )}
        </div>

        {/* PREVIOUS ANALYSES */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Historique des diagnostics</h3>
          <div className="space-y-4">
            {[
              { id: 1, culture: 'Maïs', status: 'Sain', date: 'Hier', prob: '98%' },
              { id: 2, culture: 'Riz', status: 'Carence en azote', date: '12 Oct', prob: '75%' },
              { id: 3, culture: 'Pomme de terre', status: 'Doryphore', date: '05 Oct', prob: '92%' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${item.status === 'Sain' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                    {item.status === 'Sain' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.culture}</h4>
                    <p className="text-xs text-white/50">{item.status} ({item.prob})</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SantePlantes;
