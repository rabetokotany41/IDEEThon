import React from "react";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 shadow-2xl mx-auto"
    >
      <h1 className="text-4xl md:text-5xl font-serif mb-6 text-center">Contactez-nous</h1>
      <p className="text-white/70 mb-8 text-center text-sm md:text-base">
        Vous avez des questions concernant nos offres agricoles à Madagascar ? Envoyez-nous un message.
      </p>

      <form className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Votre nom"
          className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-green-400 transition text-sm text-white placeholder-white/50"
        />
        <input
          type="email"
          placeholder="Votre email"
          className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-green-400 transition text-sm text-white placeholder-white/50"
        />
        <textarea
          placeholder="Votre message..."
          rows={5}
          className="w-full bg-black/30 border border-white/20 p-4 rounded-lg focus:outline-none focus:border-green-400 transition text-sm resize-none text-white placeholder-white/50"
        ></textarea>
        <button
          type="button"
          className="w-full py-4 mt-2 border border-green-400 text-green-400 font-bold uppercase text-sm tracking-widest hover:bg-green-400 hover:text-black transition-colors rounded-lg"
        >
          Envoyer
        </button>
      </form>
    </motion.div>
  );
};

export default Contact;
