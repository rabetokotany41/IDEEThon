import React from "react";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  return (
    <div className="w-full h-[75vh] px-4 md:px-10 py-12 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-serif mb-4">
          Contact & Assistance
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
          Nous sommes une plateforme agricole dédiée à Madagascar.
          Contactez-nous pour toute demande, partenariat ou assistance urgente.
        </p>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* INFORMATIONS */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4">À propos</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Notre mission est de connecter les agriculteurs malgaches aux marchés,
            améliorer la production agricole et faciliter l’accès aux ressources modernes.
            Nous travaillons avec les producteurs de vanille, riz, café, cacao et bien plus.
          </p>

          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>

          <div className="space-y-3 text-sm text-white/70">
            <p>📍 Antananarivo, Madagascar</p>
            <p>📧 rabetokotanyenzo@gmail.com</p>
            <p>📞 +261 38 98 913 56</p>
          </div>

          {/* URGENCE */}
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-400/30">
            <h4 className="text-red-400 font-bold mb-2">
              🚨 Service d’appel urgent
            </h4>
            <p className="text-white/70 text-sm mb-3">
              Assistance rapide et gratuite 24h/24 pour les problèmes agricoles urgents (maladies des cultures, pertes de récoltes, conseils immédiats).
            </p>
            <button className="w-full py-3 bg-red-500 hover:bg-red-600 transition rounded-lg font-bold text-white">
              Appeler maintenant
            </button>
          </div>
        </motion.div>

        {/* FORMULAIRE */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Envoyer un message</h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Votre nom"
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:border-green-400 outline-none text-white placeholder-white/50"
            />

            <input
              type="email"
              placeholder="Votre email"
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:border-green-400 outline-none text-white placeholder-white/50"
            />

            <input
              type="text"
              placeholder="Sujet"
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:border-green-400 outline-none text-white placeholder-white/50"
            />

            <textarea
              rows={5}
              placeholder="Votre message..."
              className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:border-green-400 outline-none resize-none text-white placeholder-white/50"
            />

            <button
              type="button"
              className="w-full py-4 mt-2 bg-green-500 hover:bg-green-600 transition rounded-lg font-bold uppercase tracking-widest"
            >
              Envoyer le message
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;