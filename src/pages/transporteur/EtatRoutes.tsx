import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Navigation, Clock, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../store/services/api';

// Types correspondant à la table road_alerts
interface RoadAlert {
  id: string;
  type: string;
  location: string;
  description: string;
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
  is_resolved: boolean;
  created_at: string;
}

interface FormattedAlert {
  id: string;
  type: string;
  lieu: string;
  cause: string;
  temps: string;
  gravite: string;
}

const EtatRoutes: React.FC = () => {
  const [reported, setReported] = useState(false);
  const [alertes, setAlertes] = useState<FormattedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Formulaire
  const [type, setType] = useState('Route coupée / Inondation');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Récupère les alertes non résolues (actives)
      const response = await api.get<RoadAlert[]>('/road-alerts?resolved=false');
      const formatted = response.data.map((a) => ({
        id: a.id,
        type: a.type,
        lieu: a.location,
        cause: a.description || 'Non précisé',
        temps: new Date(a.created_at).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        gravite:
          a.severity === 'CRITICAL'
            ? 'Critique'
            : a.severity === 'HIGH'
            ? 'Haute'
            : 'Modérée',
      }));
      setAlertes(formatted);
    } catch (error) {
      console.error('Erreur chargement alertes routières:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSubmit = async () => {
    if (!location) return alert('Veuillez renseigner la localisation.');

    let severity: 'MODERATE' | 'HIGH' | 'CRITICAL' = 'MODERATE';
    if (type.includes('coupée') || type.includes('pont')) severity = 'CRITICAL';
    else if (type.includes('boue') || type.includes('4x4')) severity = 'HIGH';

    setSubmitting(true);
    try {
      await api.post('/road-alerts', {
        type,
        location,
        description,
        severity,
      });
      setReported(true);
      // Rafraîchir la liste
      await fetchAlerts();
      // Réinitialiser le formulaire
      setLocation('');
      setDescription('');
      // Masquer le message de confirmation après 3 secondes
      setTimeout(() => setReported(false), 3000);
    } catch (error) {
      console.error('Erreur création alerte:', error);
      alert("Erreur lors de l'envoi de l'alerte.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    if (!window.confirm('Confirmer que la route est dégagée ?')) return;
    setResolvingId(id);
    try {
      await api.patch(`/road-alerts/${id}/resolve`);
      // Mettre à jour la liste localement ou refetch
      setAlertes((prev) => prev.filter((a) => a.id !== id));
      // Optionnel : refetch complet pour être sûr
      await fetchAlerts();
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
      alert("Erreur lors de la résolution de l'alerte.");
    } finally {
      setResolvingId(null);
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
          <AlertTriangle className="text-yellow-400" size={32} />
          État des Routes
        </h2>
        <p className="text-white/60 mt-1">
          Signalez les problèmes sur la route pour aider la communauté de transporteurs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIGNALER UN INCIDENT */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold text-white mb-6">Signaler un incident</h3>

          {!reported ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Type de problème
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 p-3 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm text-white/70"
                >
                  <option className="bg-gray-800">Route coupée / Inondation</option>
                  <option className="bg-gray-800">Boue très épaisse (4x4 requis)</option>
                  <option className="bg-gray-800">Pont impraticable</option>
                  <option className="bg-gray-800">Nid-de-poule dangereux</option>
                  <option className="bg-gray-800">Autre danger</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Localisation (PK / Village)
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={16}
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: RN7, près d'Ambohimandroso"
                    className="w-full bg-black/30 border border-white/20 py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm text-white placeholder-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Description rapide
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails supplémentaires..."
                  className="w-full bg-black/30 border border-white/20 p-3 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm text-white placeholder-white/40 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 mt-2 bg-yellow-400 text-black font-bold uppercase text-sm tracking-widest hover:bg-yellow-500 transition-colors rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <AlertTriangle size={18} />
                )}
                {submitting ? 'Envoi...' : "Envoyer l'alerte"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-green-400/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Alerte envoyée !</h4>
              <p className="text-sm text-white/60 mb-6">
                Merci d'avoir prévenu la communauté. Votre signalement est visible par tous.
              </p>
              <button
                onClick={() => setReported(false)}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-bold transition"
              >
                Signaler un autre incident
              </button>
            </div>
          )}
        </div>

        {/* FEED DES ALERTES */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Alertes récentes (non résolues)</h3>
            <button
              onClick={fetchAlerts}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
            >
              <Navigation size={14} /> Rafraîchir
            </button>
          </div>

          {loading ? (
            <div className="text-center text-white/50 py-10 flex justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : alertes.length === 0 ? (
            <div className="text-center text-white/50 py-10">
              Aucune alerte routière en cours.
            </div>
          ) : (
            <div className="space-y-4">
              {alertes.map((alerte) => (
                <div
                  key={alerte.id}
                  className="bg-black/30 rounded-xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-yellow-400/30 transition"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl mt-1 ${
                        alerte.gravite === 'Critique'
                          ? 'bg-red-400/20 text-red-400'
                          : alerte.gravite === 'Haute'
                          ? 'bg-orange-400/20 text-orange-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}
                    >
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg flex items-center gap-2">
                        {alerte.type}
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${
                            alerte.gravite === 'Critique'
                              ? 'border-red-400 text-red-400'
                              : alerte.gravite === 'Haute'
                              ? 'border-orange-400 text-orange-400'
                              : 'border-yellow-400 text-yellow-400'
                          }`}
                        >
                          {alerte.gravite}
                        </span>
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {alerte.lieu}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>Cause: {alerte.cause}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-end md:justify-center border-t border-white/5 pt-4 md:pt-0 md:border-none">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock size={12} /> {alerte.temps}
                    </span>
                    <button
                      onClick={() => handleResolve(alerte.id)}
                      disabled={resolvingId === alerte.id}
                      className="ml-auto md:ml-0 text-xs font-bold text-green-400 bg-green-400/10 hover:bg-green-400 hover:text-black px-3 py-1.5 rounded transition disabled:opacity-50"
                    >
                      {resolvingId === alerte.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        'Route dégagée ?'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EtatRoutes;