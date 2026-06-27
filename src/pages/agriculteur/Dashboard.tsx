import React, { useState, useEffect } from 'react';
import { 
  Sprout, TrendingUp, DollarSign, CloudRain, Plus, ArrowUpRight, Leaf, 
  Sun, Wind, ShoppingCart, Image as ImageIcon, AlertTriangle, Droplets, Thermometer 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../store/services/api';
import { useAuth } from '../../hooks/useAuth';
import type Dashboard from '../admin/Dashboard';

/* ── Style commun ── */
const glass = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
} as React.CSSProperties;

const card = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07 },
});

// Utilitaire pour l'URL des images
const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'https://backendidethon.onrender.com').replace(/\/$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};

const ProductImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);
  if (!imageUrl || error) {
    return <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"><ImageIcon size={16} className="text-white/30" /></div>;
  }
  return <img src={imageUrl} alt={alt} className="w-9 h-9 rounded-xl object-cover" onError={() => setError(true)} />;
};

/* ── MÉTÉO AVEC ALERTES AGRICOLES (localisation automatique) ── */

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
}

interface WeatherAlert {
  type: string;
  severity: 'warning' | 'critical';
  message: string;
  action: string;
}

// Seuils d'alerte agricole adaptés à Madagascar
const ALERT_THRESHOLDS = {
  HIGH_TEMP: { min: 35, message: "🌡️ Canicule : Risque de stress hydrique. Arrosez tôt matin ou tard soir.", action: "Augmenter l'irrigation" },
  HEAVY_RAIN: { min: 20, message: "🌧️ Pluies intenses : Risque d'engorgement des sols.", action: "Vérifier le drainage" },
  FROST: { max: 2, message: "❄️ Risque de gel : Protégez les plants sensibles.", action: "Couvrir les cultures" },
  HIGH_WIND: { min: 30, message: "💨 Vent fort : Risque pour les cultures fragiles et les serres.", action: "Consolider les structures" },
  LOW_HUMIDITY: { max: 30, message: "🌾 Sécheresse : Risque de déshydratation des plantes.", action: "Maintenir une irrigation régulière" },
};

const analyzeWeatherRisk = (weather: WeatherData): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  const { temperature, humidity, windSpeed, precipitation } = weather;

  if (temperature >= ALERT_THRESHOLDS.HIGH_TEMP.min) {
    alerts.push({ type: 'temperature', severity: 'warning', message: ALERT_THRESHOLDS.HIGH_TEMP.message, action: ALERT_THRESHOLDS.HIGH_TEMP.action });
  }
  if (temperature <= ALERT_THRESHOLDS.FROST.max) {
    alerts.push({ type: 'frost', severity: 'critical', message: ALERT_THRESHOLDS.FROST.message, action: ALERT_THRESHOLDS.FROST.action });
  }
  if (precipitation >= ALERT_THRESHOLDS.HEAVY_RAIN.min) {
    alerts.push({ type: 'rain', severity: 'warning', message: ALERT_THRESHOLDS.HEAVY_RAIN.message, action: ALERT_THRESHOLDS.HEAVY_RAIN.action });
  }
  if (windSpeed >= ALERT_THRESHOLDS.HIGH_WIND.min) {
    alerts.push({ type: 'wind', severity: 'warning', message: ALERT_THRESHOLDS.HIGH_WIND.message, action: ALERT_THRESHOLDS.HIGH_WIND.action });
  }
  if (humidity <= ALERT_THRESHOLDS.LOW_HUMIDITY.max) {
    alerts.push({ type: 'humidity', severity: 'warning', message: ALERT_THRESHOLDS.LOW_HUMIDITY.message, action: ALERT_THRESHOLDS.LOW_HUMIDITY.action });
  }
  return alerts;
};

const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{ city: string; region: string } | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lon: data.longitude,
          city: data.city || 'Antananarivo',
          region: data.region || 'Analamanga'
        };
      }
      return null;
    } catch (err) {
      console.error("Erreur localisation:", err);
      // Fallback à Antananarivo en cas de blocage de l'API (ex: limite 429 atteinte)
      return {
        lat: -18.8792,
        lon: 47.5079,
        city: 'Antananarivo',
        region: 'Analamanga'
      };
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur météo: ${res.status}`);
    const data = await res.json();
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
    };
  };

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await fetchLocation();
      if (!loc) throw new Error("Impossible d'obtenir votre position");
      setLocation({ city: loc.city, region: loc.region });
      const w = await fetchWeatherData(loc.lat, loc.lon);
      setWeather(w);
      setAlerts(analyzeWeatherRisk(w));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return { weather, location, alerts, loading, error, refresh: loadWeather };
};

const WeatherWidget: React.FC = () => {
  const { weather, location, alerts, loading, error, refresh } = useWeather();

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-4" style={{ ...glass, background: 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(14,165,233,0.06))' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col gap-4" style={{ ...glass, background: 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(14,165,233,0.06))' }}>
        <p className="text-red-400 text-sm">⚠️ {error}</p>
        <button onClick={refresh} className="text-emerald-400 text-xs hover:underline">↻ Réessayer</button>
      </div>
    );
  }

  // Déterminer l'icône météo principale (simplifié)
  let WeatherIcon = CloudRain;
  let condition = "Pluvieux";
  if (weather?.weatherCode === 0) { WeatherIcon = Sun; condition = "Ensoleillé"; }
  else if (weather?.weatherCode === 1 || weather?.weatherCode === 2) { WeatherIcon = Sun; condition = "Peu nuageux"; }
  else if (weather?.weatherCode === 3) { WeatherIcon = CloudRain; condition = "Nuageux"; }
  else if (weather?.weatherCode !== undefined && weather?.weatherCode >= 51 && weather?.weatherCode <= 67) { WeatherIcon = CloudRain; condition = "Pluie fine"; }
  else if (weather?.weatherCode !== undefined && weather?.weatherCode >= 80) { WeatherIcon = CloudRain; condition = "Averses"; }

  return (
    <div className="p-6 flex flex-col gap-4" style={{ ...glass, background: 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(14,165,233,0.06))', border: '1px solid rgba(56,189,248,0.18)' }}>
      <div>
        <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Météo locale</p>
        <h3 className="text-white font-bold text-lg">{location?.city || 'Vakinankaratra'}</h3>
        <p className="text-white/40 text-xs">{location?.region}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>
          <WeatherIcon size={28} className="text-sky-300" />
        </div>
        <div>
          <p className="text-white font-bold text-4xl leading-none">{weather?.temperature ?? '--'}°</p>
          <p className="text-sky-300/80 text-sm mt-0.5">{condition}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
          <Droplets size={14} className="text-sky-400" />
          <div><p className="text-white/50 text-[10px]">Humidité</p><p className="text-white font-semibold text-xs">{weather?.humidity ?? '--'}%</p></div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
          <Wind size={14} className="text-sky-400" />
          <div><p className="text-white/50 text-[10px]">Vent</p><p className="text-white font-semibold text-xs">{weather?.windSpeed ?? '--'} km/h</p></div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
          <CloudRain size={14} className="text-sky-400" />
          <div><p className="text-white/50 text-[10px]">Précip.</p><p className="text-white font-semibold text-xs">{weather?.precipitation ?? '--'} mm</p></div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
          <Thermometer size={14} className="text-sky-400" />
          <div><p className="text-white/50 text-[10px]">Ressenti</p><p className="text-white font-semibold text-xs">{weather?.temperature ?? '--'}°</p></div>
        </div>
      </div>

      {/* ALERTES AGRICOLES */}
      {alerts.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={16} />
            <p className="text-xs font-semibold uppercase tracking-wider">Alertes agricoles</p>
          </div>
          {alerts.map((alert, idx) => (
            <div key={idx} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <p className="text-amber-400 text-sm font-semibold">{alert.message}</p>
              <p className="text-white/70 text-xs mt-1">💡 Action conseillée : {alert.action}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={refresh} className="text-white/40 hover:text-white/70 text-xs text-center transition flex items-center justify-center gap-1 mt-2">
        ↻ Mettre à jour
      </button>
    </div>
  );
};

/* ── DashboardAgriculteur PRINCIPAL ── */

const DashboardAgriculteur: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'semaine' | 'mois'>('semaine');
  
  const [stats, setStats] = useState([
    { label: 'Revenus totaux', value: '0', unit: 'Ar', icon: DollarSign, trend: '+0%', up: true, accent: '#4ade80' },
    { label: 'Produits en vente', value: '0', unit: '', icon: Sprout, trend: 'Stable', up: true, accent: '#34d399' },
    { label: 'Ventes réalisées', value: '0', unit: '', icon: TrendingUp, trend: '+0%', up: true, accent: '#6ee7b7' },
    { label: 'Prêts en cours', value: '0', unit: '', icon: ShoppingCart, trend: 'Stable', up: true, accent: '#7dd3fc' },
  ]);

  const [products, setProducts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Récupération des stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/farmer/stats');
        const data = response.data;
        setStats([
          { label: 'Revenus totaux', value: data.totalRevenue?.toLocaleString('fr-MG') || '0', unit: 'Ar', icon: DollarSign, trend: '+12%', up: true, accent: '#4ade80' },
          { label: 'Produits en vente', value: data.totalProducts?.toString() || '0', unit: '', icon: Sprout, trend: 'Stable', up: true, accent: '#34d399' },
          { label: 'Ventes réalisées', value: data.totalOrders?.toString() || '0', unit: '', icon: TrendingUp, trend: '+5%', up: true, accent: '#6ee7b7' },
          { label: 'Prêts en cours', value: data.activeLoans?.toString() || '0', unit: '', icon: ShoppingCart, trend: 'Stable', up: true, accent: '#7dd3fc' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    if (user) fetchStats();
  }, [user]);

  // Récupération des produits
  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products/farmer/${user.id}`);
        const data = response.data.slice(0, 4);
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          unit: p.unit || 'kg',
          price: p.price,
          is_available: p.is_available,
          image_url: p.image_url,
          pct: Math.min(100, Math.floor((p.quantity / (p.quantity + 50)) * 100)),
          status: p.is_available ? 'En vente' : 'Rupture',
        })));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [user]);

  // Récupération des activités
  useEffect(() => {
    if (!user) return;
    const fetchActivities = async () => {
      try {
        const response = await api.get(`/orders/farmer/${user.id}?limit=4`);
        const orders = response.data;
        const mapped = orders.map((order: any) => ({
          action: order.status === 'delivered' ? 'Vente confirmée' : 'Commande reçue',
          details: `${order.quantity} ${order.unit} de ${order.product_name || 'produit'} → ${order.buyer_name || 'Acheteur'}`,
          time: timeAgo(new Date(order.created_at)),
          amount: order.total_price ? `+${order.total_price.toLocaleString('fr-MG')} Ar` : '',
        }));
        setActivities(mapped);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([
          { action: 'Vente confirmée', details: '200 kg de Maïs → Coopérative Beta', time: '2h', amount: '+160 000 Ar' },
          { action: 'Produit ajouté', details: 'Tomates fraîches (50 kg)', time: 'Hier', amount: '' },
          { action: 'Paiement reçu', details: 'Mvola — Commande #1042', time: '2j', amount: '+150 000 Ar' },
          { action: 'Alerte météo', details: 'Pluies — Vakinankaratra', time: '3j', amount: '' },
        ]);
      }
    };
    fetchActivities();
  }, [user]);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'à l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days} j`;
  };

  // Graphique factice
  const bars = [40, 65, 50, 80, 55, 90, 70];
  const barsMois = [55, 70, 60, 85, 75, 95, 80, 65, 70, 88, 60, 78];
  const labels = tab === 'semaine' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['J1', 'J5', 'J10', 'J15', 'J20', 'J25', 'J30', 'J5', 'J10', 'J15', 'J20', 'J25'];
  const data = tab === 'semaine' ? bars : barsMois;
  const maxB = Math.max(...data);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-white/35 text-xs font-medium mb-1 uppercase tracking-widest">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-white font-bold text-2xl leading-tight">Bonjour, {(user as any)?.name || 'Producteur'} 👋</h2>
          <p className="text-white/40 text-sm mt-1">Voici un aperçu de votre exploitation aujourd'hui.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...card(i)} style={glass} className="p-5 flex flex-col gap-4 hover:border-white/16 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.accent + '1a', border: `1px solid ${s.accent}30` }}>
                  <Icon size={19} style={{ color: s.accent }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.accent + '18', color: s.accent }}>
                  {s.trend}
                </span>
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium mb-1">{s.label}</p>
                <p className="text-white font-bold text-2xl leading-none">{s.value}{s.unit && <span className="text-white/40 text-sm font-normal ml-1">{s.unit}</span>}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Graphique + Météo (avec alertes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique */}
        <motion.div {...card(4)} style={glass} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Performance</p>
              <h3 className="text-white font-bold text-lg">Ventes</h3>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {(['semaine', 'mois'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all" style={tab === t ? { background: '#4ade80', color: '#000' } : { color: 'rgba(255,255,255,0.4)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: 96 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(v / maxB) * 100}%` }} transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }} className="absolute bottom-0 w-full rounded-t-lg" style={{ background: 'linear-gradient(to top,#4ade80,#86efac60)' }} />
                </div>
                <span className="text-white/30 text-[10px]">{labels[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Widget Météo dynamique avec alertes */}
        <WeatherWidget />
      </div>

      {/* Produits et Activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Produits récents */}
        <motion.div {...card(6)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-base">Mes Produits récents</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:opacity-80">Voir tout <ArrowUpRight size={13} /></button>
          </div>
          <div className="space-y-4">
            {products.length === 0 ? <p className="text-white/40 text-sm text-center py-4">Aucun produit pour le moment</p> : (
              products.map((p, i) => (
                <div key={p.id || i} className="flex items-center gap-4">
                  <ProductImage src={p.image_url} alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Rupture' ? 'text-orange-400 bg-orange-400/15' : 'text-emerald-400 bg-emerald-400/15'}`}>{p.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/35 mb-2">
                      <span>{p.quantity} {p.unit}</span>
                      <span>{p.price.toLocaleString('fr-MG')} Ar/{p.unit}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.status === 'Rupture' ? '#fb923c' : 'linear-gradient(90deg,#4ade80,#22d3ee)' }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Activités récentes */}
        <motion.div {...card(7)} style={glass} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-base">Activités récentes</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:opacity-80">Historique <ArrowUpRight size={13} /></button>
          </div>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${a.amount ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{a.action}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{a.details}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white/25 text-xs">{a.time}</p>
                  {a.amount && <p className="text-emerald-400 font-bold text-xs mt-0.5">{a.amount}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardAgriculteur;