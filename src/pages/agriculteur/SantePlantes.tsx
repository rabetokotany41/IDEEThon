import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Upload, AlertTriangle, CheckCircle, Search, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Diagnosis {
  id: string;
  plant_name: string;
  disease_name: string | null;
  confidence: number;
  is_healthy: boolean;
  treatment: string | null;
  image_url: string | null;
  created_at: string;
}

const SantePlantes: React.FC = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [history, setHistory] = useState<Diagnosis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'historique des diagnostics
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        // Adapter l'endpoint selon votre backend
        // Par exemple: GET /quality/farmer/:farmerId ou /plants/history
        const response = await api.get(`/quality/farmer/${user.id}`);
        setHistory(response.data);
      } catch (err) {
        console.error('Erreur historique:', err);
        // Si l'endpoint n'existe pas, on peut essayer /plants
        try {
          const res = await api.get(`/plants/farmer/${user.id}`);
          setHistory(res.data);
        } catch (e) {
          console.error('Aucun historique trouvé');
          setHistory([]);
        }
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Veuillez d'abord sélectionner une photo.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('farmerId', user?.id || '');
      // Appel à votre endpoint d'analyse IA
      const response = await api.post('/plants/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      // Rafraîchir l'historique
      const historyRes = await api.get(`/quality/farmer/${user?.id}`);
      setHistory(historyRes.data);
    } catch (err: any) {
      console.error('Erreur analyse:', err);
      setError(err.response?.data?.message || "L'analyse a échoué. Réessayez.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  // Fonction pour déterminer l'icône et la couleur selon le résultat
  const getStatusBadge = (isHealthy: boolean, confidence: number) => {
    if (isHealthy) {
      return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/20', label: 'Sain' };
    }
    return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/20', label: 'Malade' };
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
        
        {/* SECTION UPLOAD / RÉSULTAT */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          {!analyzing && !result && !imagePreview && (
            <div className="w-full flex flex-col items-center">
              <label className="cursor-pointer w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center text-green-400 hover:bg-green-400/20 transition">
                <Upload size={32} />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <h3 className="text-xl font-bold text-white mt-4">Importer une photo</h3>
              <p className="text-white/50 text-sm mt-2 mb-6 max-w-sm">Assurez-vous que la zone malade (feuille, tige, fruit) soit bien visible et éclairée.</p>
              <button 
                onClick={handleAnalyze}
                disabled={!imageFile}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  imageFile 
                    ? 'bg-green-700/50 border border-white/20 text-white/80 hover:bg-white/10' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Lancer le diagnostic
              </button>
            </div>
          )}

          {imagePreview && !analyzing && !result && (
            <div className="w-full flex flex-col items-center">
              <img src={imagePreview} alt="Aperçu" className="w-48 h-48 object-cover rounded-xl mb-4 border border-white/20" />
              <div className="flex gap-3">
                <button onClick={handleAnalyze} className="px-4 py-2 bg-green-700/50 rounded-full text-white text-sm">Analyser</button>
                <button onClick={resetForm} className="px-4 py-2 bg-white/10 rounded-full text-white/70 text-sm">Changer</button>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-white">L'IA analyse votre photo...</h3>
              <p className="text-white/50 text-sm mt-2">Recherche de plus de 150 maladies connues.</p>
            </div>
          )}

          {result && (
            <div className="w-full text-left">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-3 ${result.is_healthy ? 'text-green-400' : 'text-red-400'}`}>
                  {result.is_healthy ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                  <h3 className="text-xl font-bold">
                    {result.is_healthy ? 'Plante saine' : `Maladie détectée : ${result.disease_name || 'Inconnue'}`}
                  </h3>
                </div>
                <button onClick={resetForm} className="text-white/50 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6 space-y-2 text-sm text-white/80">
                <p><strong>Certitude IA :</strong> <span className="text-green-400">{result.confidence}%</span></p>
                {!result.is_healthy && result.treatment && (
                  <p><strong>Traitement recommandé :</strong> {result.treatment}</p>
                )}
              </div>
              {!result.is_healthy && (
                <>
                  <h4 className="font-bold text-white mb-2">Actions recommandées :</h4>
                  <ul className="list-disc pl-5 text-white/70 text-sm space-y-1 mb-6">
                    <li>Retirer immédiatement les parties touchées.</li>
                    <li>Appliquer un traitement adapté (fongicide, insecticide).</li>
                    <li>Surveiller l'humidité et l'aération.</li>
                  </ul>
                </>
              )}
              <button 
                onClick={resetForm}
                className="cursor-pointer px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition"
              >
                Analyser une autre photo
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center mt-4">{error}</div>
          )}
        </div>

        {/* HISTORIQUE DES DIAGNOSTICS */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Historique des diagnostics</h3>
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
            </div>
          ) : history.length === 0 ? (
            <p className="text-white/40 text-center py-8">Aucun diagnostic effectué.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const { icon: Icon, color, bg, label } = getStatusBadge(item.is_healthy, item.confidence);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${bg} ${color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.plant_name}</h4>
                        <p className="text-xs text-white/50">{item.disease_name || label} ({item.confidence}%)</p>
                      </div>
                    </div>
                    <span className="text-xs text-white/40">{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
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

export default SantePlantes;