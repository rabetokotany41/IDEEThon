import React from 'react';
import { motion } from 'framer-motion';

const Meteo: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 text-white max-w-4xl mx-auto mt-24"
    >
      <h1 className="text-4xl font-serif mb-6 text-green-400">Prévisions Météorologiques</h1>
      <p className="text-white/70 text-lg">Cette page affichera bientôt les prévisions météo locales pour aider les agriculteurs à planifier leurs récoltes.</p>
      
      <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
        <p className="text-white/50 text-center">Module en cours de développement...</p>
      </div>
    </motion.div>
  );
};

export default Meteo;