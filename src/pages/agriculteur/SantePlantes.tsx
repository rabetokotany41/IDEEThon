import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Upload, AlertTriangle, CheckCircle, X,
  Trash2, Camera, Clock, Zap, Shield, Eye,
  ChevronRight, RefreshCw, ImageIcon
} from 'lucide-react';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface AIResult {
  id: string;
  plant_name: string;
  disease_name: string | null;
  confidence: number;
  is_healthy: boolean;
  health_score: number;          // 0–100 : score de santé retourné par Flask
  severity: 'légère' | 'modérée' | 'sévère' | null;
  symptoms: string[];
  treatment: string | null;
  prevention: string;
  urgency: 'immédiate' | 'sous 48h' | 'surveillance' | 'aucune';
  image_url: string | null;
  created_at: string;
}

/* ─── Jauge de santé circulaire ──────────────────────────────────────────── */
const HealthGauge: React.FC<{ score: number; isHealthy: boolean }> = ({ score, isHealthy }) => {
  const radius = 52;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const color = isHealthy
    ? '#4ade80'                                        
    : score >= 60 ? '#fbbf24'
    : score >= 30 ? '#fb923c'
    : '#f87171';                                       
  const label = isHealthy ? 'Bonne santé' : score >= 60 ? 'Légèrement atteinte' : score >= 30 ? 'Maladie modérée' : 'État critique';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
        {/* Fond */}
        <circle cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        {/* Arc animé */}
        <motion.circle cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        {/* Texte centré — contre-rotation */}
        <g transform={`rotate(90, ${radius}, ${radius})`}>
          <text x={radius} y={radius - 6} textAnchor="middle" dominantBaseline="middle"
            fontSize="20" fontWeight="bold" fill={color}>{progress}%</text>
          <text x={radius} y={radius + 14} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="rgba(255,255,255,0.4)">SANTÉ</text>
        </g>
      </svg>
      <p style={{ color, fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>{label}</p>
    </div>
  );
};

interface HistoryItem {
  id: string;
  plant_name: string;
  disease_name: string | null;
  confidence: number;
  is_healthy: boolean;
  treatment: string | null;
  image_url: string | null;
  created_at: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'https://backendidethon.onrender.com';

const urgencyConf = {
  immédiate: { color: '#f87171', bg: 'rgba(248,113,113,0.15)', label: '🚨 Action immédiate' },
  'sous 48h': { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', label: '⚡ Sous 48 heures' },
  surveillance: { color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', label: '👁 Surveiller' },
  aucune: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', label: '✅ Aucune action' },
};

const severityConf = {
  légère: { color: '#fbbf24', label: 'Légère' },
  modérée: { color: '#fb923c', label: 'Modérée' },
  sévère: { color: '#f87171', label: 'Sévère' },
};

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};

/* ─── Composant principal ────────────────────────────────────────────────── */
const SantePlantes: React.FC = () => {
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [progress, setProgress] = useState(0);

  /* ── Charger l'historique ── */
  const fetchHistory = async () => {
    if (!isAuthenticated || !user?.id) { setLoadingHistory(false); return; }
    abortRef.current = new AbortController();
    setLoadingHistory(true);
    try {
      const res = await api.get<HistoryItem[]>(`/plants/history/${user.id}`, {
        signal: abortRef.current.signal,
      });
      setHistory(res.data);
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => abortRef.current?.abort();
  }, [isAuthenticated, user?.id]);

  /* ── Sélection d'image ── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 8 Mo.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
    setError(null);
  };

  /* ── Analyse IA ── */
  const handleAnalyze = async () => {
    if (!imageFile) { setError('Veuillez sélectionner une photo.'); return; }
    if (!isAuthenticated || !user?.id) {
      setError('Vous devez être connecté pour analyser une plante.');
      return;
    }
    setAnalyzing(true);
    setError(null);
    setProgress(0);

    // Animation de progression simulée
    const ticker = setInterval(() => {
      setProgress(p => (p < 85 ? p + Math.random() * 8 : p));
    }, 400);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('farmerId', user.id);

    try {
      const response = await api.post<AIResult>('/plants/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000,
      });
      setProgress(100);
      setResult(response.data);
      // Rafraîchir l'historique
      setTimeout(() => fetchHistory(), 500);
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError("L'analyse a pris trop de temps. Vérifiez votre connexion.");
      } else {
        setError(err.response?.data?.message || "L'analyse a échoué. Réessayez.");
      }
    } finally {
      clearInterval(ticker);
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteHistory = async (id: string) => {
    try {
      await api.delete(`/plants/${id}`);
      setHistory(h => h.filter(item => item.id !== id));
      if (selectedHistory?.id === id) setSelectedHistory(null);
    } catch { /* ignore */ }
  };

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">IA Phytosanitaire</p>
          <h2 className="text-white font-bold text-2xl flex items-center gap-2">
            <Leaf size={22} className="text-green-400" />
            Diagnostic IA des Plantes
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Analysez vos cultures grâce à l'intelligence artificielle Gemini Vision.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AI pour Verifier le maladie de Plante
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── PANNEAU UPLOAD / ANALYSE ── */}
        <div style={glass} className="p-6 flex flex-col items-center justify-center min-h-[380px]">
          <AnimatePresence mode="wait">

            {/* État initial : upload */}
            {!analyzing && !result && !imagePreview && (
              <motion.div key="upload"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} className="w-full flex flex-col items-center text-center">
                <label htmlFor="plant-image" className="cursor-pointer group">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200 group-hover:scale-105"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '2px dashed rgba(74,222,128,0.4)' }}>
                    <Upload size={36} className="text-green-400" />
                  </div>
                  <input ref={fileInputRef} id="plant-image" type="file"
                    accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
                <h3 className="text-white font-bold text-xl mb-2">Importer une photo</h3>
                <p className="text-white/45 text-sm max-w-xs mb-1">
                  Photo de la feuille, tige ou fruit suspect — bien éclairée et nette.
                </p>
                <p className="text-white/25 text-xs mb-6">JPEG · PNG · WebP · Max 8 Mo</p>

              </motion.div>
            )}

            {/* Image sélectionnée : aperçu */}
            {imagePreview && !analyzing && !result && (
              <motion.div key="preview"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center">
                <div className="relative mb-5">
                  <img src={imagePreview} alt="Aperçu"
                    className="w-52 h-52 object-cover rounded-2xl border border-white/20 shadow-xl" />
                  <button onClick={resetForm}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition">
                    <X size={13} className="text-white" />
                  </button>
                </div>
                <p className="text-white/50 text-sm mb-5">{imageFile?.name}</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAnalyze}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-black transition-all bg-green-500/80 hover:bg-green-500/90 shadow-lg shadow-green-500/30"

                    style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                    <Zap size={14} className="inline mr-1.5" />
                    Analyser la maladie
                  </motion.button>

                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/60 hover:text-white transition bg-white/5 border border-white/10"
                  >
                    Changer
                  </button>
                </div>
              </motion.div>
            )}

            {/* En cours d'analyse */}
            {analyzing && (
              <motion.div key="analyzing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center text-center">
                {imagePreview && (
                  <div className="relative mb-5">
                    <img src={imagePreview} alt="Analyse en cours"
                      className="w-40 h-40 object-cover rounded-2xl opacity-60 blur-[1px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 rounded-full animate-spin"
                        style={{ borderColor: 'rgba(74,222,128,0.2)', borderTopColor: '#4ade80' }} />
                    </div>
                  </div>
                )}
                <h3 className="text-white font-bold text-lg mb-2">Gemini Vision analyse votre photo…</h3>
                <p className="text-white/45 text-sm mb-4">Détection parmi 150+ maladies tropicales</p>
                {/* Barre de progression */}
                <div className="w-full max-w-xs bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#16a34a,#4ade80)', width: `${progress}%` }}
                    transition={{ duration: 0.3 }} />
                </div>
                <p className="text-white/30 text-xs mt-2">{Math.round(progress)}%</p>
              </motion.div>
            )}

            {/* Résultat IA */}
            {result && !analyzing && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} className="w-full">

                {/* Header résultat */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center gap-2.5 ${result.is_healthy ? 'text-green-400' : 'text-red-400'}`}>
                    {result.is_healthy ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {result.is_healthy ? '🌿 Plante saine' : `🦠 ${result.disease_name || 'Maladie détectée'}`}
                      </h3>
                      <p className="text-white/50 text-xs">{result.plant_name}</p>
                    </div>
                  </div>
                  <button onClick={resetForm} className="text-white/40 hover:text-white transition ml-2 mt-0.5">
                    <X size={18} />
                  </button>
                </div>

                {/* ── Jauge de santé ── */}
                <div className="flex items-center justify-center gap-6 mb-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <HealthGauge
                    score={result.health_score ?? (result.is_healthy ? Math.round(result.confidence) : 20)}
                    isHealthy={result.is_healthy}
                  />
                  <div className="flex flex-col gap-2.5">
                    {/* Barre bonne santé */}
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span style={{ color: '#4ade80' }}>🌿 Bonne santé</span>
                        <span className="text-white/40">
                          {result.is_healthy
                            ? Math.round(result.confidence)
                            : (result.health_score ?? 20)}%
                        </span>
                      </div>
                      <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg,#16a34a,#4ade80)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.is_healthy ? Math.round(result.confidence) : (result.health_score ?? 20)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }} />
                      </div>
                    </div>
                    {/* Barre risque maladie */}
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span style={{ color: '#f87171' }}>🦠 Risque maladie</span>
                        <span className="text-white/40">
                          {result.is_healthy
                            ? Math.max(0, 100 - Math.round(result.confidence))
                            : Math.min(100, 100 - (result.health_score ?? 20))}%
                        </span>
                      </div>
                      <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg,#dc2626,#f87171)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.is_healthy ? Math.max(0, 100 - Math.round(result.confidence)) : Math.min(100, 100 - (result.health_score ?? 20))}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} />
                      </div>
                    </div>
                    <p className="text-white/20 text-[9px]">Certitude modèle : {Math.round(result.confidence)}%</p>
                  </div>
                </div>

                {/* Image + badges */}
                <div className="flex gap-3 mb-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Plante analysée"
                      className="w-20 h-20 object-cover rounded-xl border border-white/15 flex-shrink-0" />
                  )}
                  <div className="flex flex-col gap-1.5 justify-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                      🎯 Certitude : {Math.round(result.confidence)}%
                    </span>
                    {!result.is_healthy && result.severity && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: severityConf[result.severity]?.color + '18',
                          color: severityConf[result.severity]?.color,
                        }}>
                        ⚠️ Sévérité : {severityConf[result.severity]?.label}
                      </span>
                    )}
                    {result.urgency && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={urgencyConf[result.urgency]}>
                        {urgencyConf[result.urgency]?.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptômes */}
                {result.symptoms && result.symptoms.length > 0 && (
                  <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-red-400 text-xs font-bold mb-1.5">Symptômes détectés :</p>
                    <ul className="space-y-0.5">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="text-white/65 text-xs flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Traitement */}
                {!result.is_healthy && result.treatment && (
                  <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                    <p className="text-yellow-400 text-xs font-bold mb-1">💊 Traitement recommandé :</p>
                    <p className="text-white/70 text-xs leading-relaxed">{result.treatment}</p>
                  </div>
                )}

                {/* Prévention */}
                {result.prevention && (
                  <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                    <p className="text-blue-400 text-xs font-bold mb-1">🛡 Prévention :</p>
                    <p className="text-white/65 text-xs leading-relaxed">{result.prevention}</p>
                  </div>
                )}

                <button onClick={resetForm}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <RefreshCw size={13} className="inline mr-1.5" />
                  Analyser une autre photo
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 w-full px-4 py-3 rounded-xl text-red-400 text-sm text-center"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <AlertTriangle size={14} className="inline mr-1.5" />{error}
            </motion.div>
          )}
        </div>

        {/* ── HISTORIQUE ── */}
        <div style={glass} className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Clock size={16} className="text-white/40" />
              Historique des diagnostics
            </h3>
            <button onClick={fetchHistory}
              className="text-white/30 hover:text-white/70 transition p-1 rounded-lg hover:bg-white/5">
              <RefreshCw size={14} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(74,222,128,0.2)', borderTopColor: '#4ade80' }} />
            </div>
          ) : history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Leaf size={36} className="text-white/15 mb-3" />
              <p className="text-white/35 text-sm">Aucun diagnostic effectué.</p>
              <p className="text-white/20 text-xs mt-1">Importez votre première photo ci-contre.</p>
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-[480px]">
              {history.map((item) => (
                <motion.div key={item.id}
                  layout
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group"
                  style={{
                    background: selectedHistory?.id === item.id ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)',
                    border: selectedHistory?.id === item.id
                      ? '1px solid rgba(74,222,128,0.25)'
                      : '1px solid rgba(255,255,255,0.06)',
                  }}
                  onClick={() => setSelectedHistory(selectedHistory?.id === item.id ? null : item)}>

                  {/* Miniature image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={`${API_BASE}${item.image_url}`}
                        alt={item.plant_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon size={18} className="text-white/20" />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.is_healthy
                        ? <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                        : <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />}
                      <p className="text-white font-semibold text-sm truncate">{item.plant_name}</p>
                    </div>
                    <p className="text-white/40 text-xs truncate">
                      {item.disease_name || (item.is_healthy ? 'Sain' : 'Maladie')} · {Math.round(item.confidence)}%
                    </p>
                    <p className="text-white/25 text-[10px] mt-0.5">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition">
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={14} className="text-white/20" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Détail historique sélectionné */}
          <AnimatePresence>
            {selectedHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-bold text-sm">{selectedHistory.plant_name}</p>
                    <button onClick={() => setSelectedHistory(null)} className="text-white/30 hover:text-white transition">
                      <X size={14} />
                    </button>
                  </div>
                  {selectedHistory.disease_name && (
                    <p className="text-red-400 text-xs mb-1.5">
                      🦠 {selectedHistory.disease_name}
                    </p>
                  )}
                  {selectedHistory.treatment && (
                    <p className="text-white/60 text-xs leading-relaxed">
                      <span className="text-yellow-400 font-semibold">Traitement : </span>
                      {selectedHistory.treatment}
                    </p>
                  )}
                  {selectedHistory.image_url && (
                    <a href={`${API_BASE}${selectedHistory.image_url}`} target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline">
                      <Eye size={11} /> Voir l'image originale
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
};

export default SantePlantes;