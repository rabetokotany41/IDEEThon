import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Clock, CheckCircle, AlertTriangle, Navigation, Fuel, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';

// Styles constants
const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};
const card = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
});

const ACCENT = '#fb923c';

// Types correspondant à la base de données
interface DeliveryMission {
  id: string;
  origin: string;
  destination: string;
  distance: number | null;
  status: 'PENDING' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  delivery_price: number;
  order_id: string;
  transporter_id: string | null;
  created_at: string;
}

interface RoadAlert {
  id: string;
  type: string;
  location: string;
  description: string;
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
  is_resolved: boolean;
  created_at: string;
}

interface TransporterStats {
  monthlyMissions: number;
  totalDistance: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [mTab, setMTab] = useState<'actives' | 'terminees'>('actives');

  const [stats, setStats] = useState([
    { label: 'Missions ce mois', value: '0', unit: '', icon: Truck, accent: ACCENT, trend: 'Ce mois' },
    { label: 'Distance parcourue', value: '0', unit: 'km', icon: Navigation, accent: '#fbbf24', trend: 'Ce mois' },
    { label: 'Revenus du mois', value: '0', unit: 'Ar', icon: Package, accent: '#facc15', trend: 'Global' },
    { label: 'Note transporteur', value: '4.6', unit: '/5', icon: Star, accent: '#a3e635', trend: 'Très bien' },
  ]);

  const [missionData, setMissionData] = useState({ actives: [] as any[], terminees: [] as any[] });
  const [alerts, setAlerts] = useState<RoadAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données du tableau de bord
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // 1. Statistiques du transporteur (à implémenter côté backend)
        const statsRes = await api.get<TransporterStats>(`/delivery/transporter/${user.id}/stats`);
        setStats([
          { label: 'Missions ce mois', value: statsRes.data.monthlyMissions.toString(), unit: '', icon: Truck, accent: ACCENT, trend: 'Ce mois' },
          { label: 'Distance parcourue', value: statsRes.data.totalDistance.toString(), unit: 'km', icon: Navigation, accent: '#fbbf24', trend: 'Global' },
          { label: 'Revenus globaux', value: statsRes.data.totalRevenue.toLocaleString('fr-MG'), unit: 'Ar', icon: Package, accent: '#facc15', trend: 'Total' },
          { label: 'Note transporteur', value: '4.6', unit: '/5', icon: Star, accent: '#a3e635', trend: 'Très bien' },
        ]);

        // 2. Missions du transporteur
        const missionsRes = await api.get<DeliveryMission[]>(`/delivery/missions?transporterId=${user.id}`);
        const allMissions = missionsRes.data;

        const formatMission = (m: any) => ({
          id: `#MSS-${m.id.slice(0, 6).toUpperCase()}`,
          route: `${m.origin} → ${m.destination}`,
          cargo: m.product_name ? `${m.quantity} ${m.unit} de ${m.product_name}` : `Commande N°${m.order_id.slice(0, 4)}`,
          client: `Véhicule: ${m.vehicle_type || 'Non spécifié'}`,
          distance: `${m.distance || 0} km`,
          status: m.status === 'DELIVERED' ? 'Livré' : 
                  (m.status === 'IN_TRANSIT' || m.status === 'PREPARING') ? 'En route' : m.status,
          eta: new Date(m.created_at).toLocaleDateString('fr-FR'),
        });

        setMissionData({
          actives: allMissions
            .filter(m => m.status !== 'DELIVERED' && m.status !== 'CANCELLED')
            .map(formatMission),
          terminees: allMissions
            .filter(m => m.status === 'DELIVERED')
            .map(formatMission),
        });

        // 3. Alertes routières non résolues
        const alertsRes = await api.get<RoadAlert[]>('/road-alerts?resolved=false');
        setAlerts(alertsRes.data.slice(0, 3)); // on garde les 3 plus récentes
      } catch (error) {
        console.error('Erreur chargement dashboard transporteur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Transformation des alertes routières pour l'affichage
  const displayedAlerts = alerts.map(alert => {
    let type: 'warning' | 'info' | 'alert' = 'info';
    if (alert.severity === 'CRITICAL') type = 'alert';
    else if (alert.severity === 'HIGH') type = 'warning';
    const msg = `${alert.type} — ${alert.location} : ${alert.description}`;
    return { msg, type };
  });

  const alertConf: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
    warning: { bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)', color: '#fb923c', icon: <AlertTriangle size={14} /> },
    info:    { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)', color: '#38bdf8', icon: <MapPin size={14} /> },
    alert:   { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', color: '#f87171', icon: <AlertTriangle size={14} /> },
  };

  const missions = mTab === 'actives' ? missionData.actives : missionData.terminees;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-2xl">Bonjour, {user?.fullName || 'Transporteur'} 🚛</h2>
          <p className="text-white/40 text-sm mt-1">{missionData.actives.length} missions actives aujourd'hui.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.28)' }}
        >
          <MapPin size={16} /> Voir les Missions
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...card(i)} style={glass} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.accent + '1a', border: `1px solid ${s.accent}30` }}>
                  <Icon size={19} style={{ color: s.accent }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: s.accent + '18', color: s.accent }}>{s.trend}</span>
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium mb-1">{s.label}</p>
                <p className="text-white font-bold text-2xl leading-none">
                  {s.value}
                  {s.unit && <span className="text-white/40 text-sm font-normal ml-1">{s.unit}</span>}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2 : Missions + Véhicule/Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Missions */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-base">Mes Missions</h3>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {(['actives', 'terminees'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setMTab(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={mTab === key ? { background: ACCENT, color: '#000' } : { color: 'rgba(255,255,255,0.4)' }}
                >
                  {key === 'actives' ? 'Actives' : 'Terminées'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {missions.length === 0 ? (
              <div className="text-center text-white/40 py-6">Aucune mission {mTab === 'actives' ? 'active' : 'terminée'}</div>
            ) : (
              missions.map((m, i) => (
                <div key={i} className="p-4 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-white font-bold text-sm">{m.route}</p>
                      <p className="text-white/35 text-xs mt-0.5">{m.id} · {m.cargo} · {m.client}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={m.status === 'Livré'
                        ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
                        : m.status === 'En route'
                        ? { background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }
                        : { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                      {m.status === 'Livré' ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs flex items-center gap-1"><Navigation size={10} /> {m.distance}</span>
                    <span className="text-white/30 text-xs flex items-center gap-1"><Clock size={10} /> {m.eta}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Véhicule (données statiques ou à rendre dynamiques) */}
          <motion.div {...card(5)} style={glass} className="p-5">
            <h3 className="text-white font-bold text-sm mb-4">État du Véhicule</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)' }}>
                <Truck size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Toyota HiAce</p>
                <p className="text-white/35 text-xs">MH-4821 · 2 Tonnes</p>
              </div>
            </div>
            {[
              { label: 'Carburant', pct: 68, color: '#4ade80', icon: <Fuel size={12} style={{ color: '#4ade80' }} /> },
              { label: 'Maintenance', pct: 85, color: '#fbbf24', icon: <Truck size={12} style={{ color: '#fbbf24' }} /> },
            ].map((v, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">{v.icon} {v.label}</div>
                  <span className="text-white font-bold text-xs">{v.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${v.pct}%`, background: v.color }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Alertes routes depuis la base */}
          <motion.div {...card(6)} style={glass} className="p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <AlertTriangle size={15} style={{ color: ACCENT }} /> Alertes Routes
            </h3>
            <div className="space-y-2">
              {displayedAlerts.length === 0 ? (
                <div className="text-white/40 text-xs text-center py-3">Aucune alerte routière</div>
              ) : (
                displayedAlerts.map((a, i) => {
                  const ac = alertConf[a.type];
                  return (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl text-xs font-medium"
                      style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.color }}>
                      {ac.icon}
                      <span>{a.msg}</span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;