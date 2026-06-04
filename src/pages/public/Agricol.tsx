import React from "react";
import { motion } from "framer-motion";
import Agricol1 from "../../assets/images/agricol1.jpeg";
import Agricol2 from "../../assets/images/agricol2.jpeg";
import Agricol3 from "../../assets/images/agricol3.jpeg";

const Agricol: React.FC = () => {
  const cards = [
    { id: 0, title: "Semences de qualité", desc: "Trouvez les meilleures semences pour vos champs", img: Agricol1 },
    { id: 1, title: "Matériel Agricole", desc: "Louez ou achetez des équipements modernes", img: Agricol2 },
    { id: 2, title: "Marché B2B", desc: "Connectez-vous directement avec les acheteurs", img: Agricol3 },
  ];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-serif mb-4">Plateforme Agricol</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Explorez notre marché, découvrez de nouveaux équipements et trouvez les semences parfaites pour la saison.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <div className="h-48 w-full overflow-hidden">
              <img src={card.img} alt={card.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm opacity-70 mb-4">{card.desc}</p>
              <button className="text-green-400 font-bold text-sm hover:underline">Découvrir</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Agricol;
