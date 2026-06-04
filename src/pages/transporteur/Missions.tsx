import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Package, DollarSign } from 'lucide-react';

const Missions: React.FC = () => {
  const missions = [
    { id: 1, depart: 'Itasy', arrivee: 'Antananarivo', distance: '120 km', charge: '1.5 Tonnes', prix: '150,000 Ar', date: 'Demain matin', urgence: 'Haute' },
    { id: 2, depart: 'Fianarantsoa', arrivee: 'Antsirabe', distance: '240 km', charge: '3 Tonnes', prix: '400,000 Ar', date: 'Dans 2 jours', urgence: 'Normale' },
    { id: 3, depart: 'Ambatolampy', arrivee: 'Antananarivo', distance: '70 km', charge: '500 kg', prix: '80,000 Ar', date: 'Aujourd\'hui', urgence: 'Très Haute' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-serif text-white">Missions Disponibles</h2>
        <p className="text-white/60 mt-1">Trouvez des trajets adaptés à votre véhicule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-green-400/50 transition group">
            <div className="p-5 border-b border-white/5 bg-black/20">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  mission.urgence === 'Très Haute' ? 'bg-red-400/20 text-red-400' :
                  mission.urgence === 'Haute' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-blue-400/20 text-blue-400'
                }`}>
                  Urgence: {mission.urgence}
                </span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <DollarSign size={16} /> {mission.prix}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-0.5 h-6 bg-white/20"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-white font-bold">{mission.depart}</p>
                  <p className="text-white/40 text-xs my-1">↓ {mission.distance}</p>
                  <p className="text-green-400 font-bold">{mission.arrivee}</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Package size={16} /> {mission.charge}
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Navigation size={16} /> {mission.date}
                </div>
              </div>
              
              <button className="w-full py-3 bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400 hover:text-black font-bold rounded-lg transition mt-2">
                Accepter la mission
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Missions;
