import React from "react";
import { motion } from "framer-motion";
import Tomate from "../../assets/images/Tomate.jpeg";
import Carotte from "../../assets/images/carrote.jpeg";
import Chou from "../../assets/images/chou.jpeg";
import Oignon from "../../assets/images/oinion.webp";
import Vanille from "../../assets/images/vanile.jpeg";
import Girofle from "../../assets/images/girofle.jpeg";
import Cafe from "../../assets/images/cafe.jpeg";
import Cacao from "../../assets/images/cacao.jpeg";
import Litchi from "../../assets/images/litchi.jpeg";
import Mangue from "../../assets/images/mangue.jpeg";
import Banane from "../../assets/images/Banane.webp";
import Orange from "../../assets/images/Orange.jpeg";
const Agricol: React.FC = () => {
  const cards = [
    // Cultures maraîchères
    {
      id: 1,
      name: "Tomate",
      category: "Cultures maraîchères",
      img: Tomate,
      desc: "Juteuse et savoureuse, idéale pour les salades et sauces.",
    },
    {
      id: 2,
      name: "Carotte",
      category: "Cultures maraîchères",
      img: Carotte,
      desc: "Riche en vitamines, parfaite crue ou cuite.",
    },
    {
      id: 3,
      name: "Chou",
      category: "Cultures maraîchères",
      img: Chou,
      desc: "Croquant et nutritif, incontournable dans les potages.",
    },
    {
      id: 4,
      name: "Oignon",
      category: "Cultures maraîchères",
      img: Oignon,
      desc: "Aromatique, base de nombreux plats traditionnels.",
    },

    // Cultures de rente et épices
    {
      id: 5,
      name: "Vanille",
      category: "Cultures de rente et épices",
      img: Vanille,
      desc: "La vanille de Madagascar est reconnue parmi les meilleures au monde.",
    },
    {
      id: 6,
      name: "Girofle",
      category: "Cultures de rente et épices",
      img: Girofle,
      desc: "Épice emblématique de la côte Est malgache.",
    },
    {
      id: 7,
      name: "Café",
      category: "Cultures de rente et épices",
      img: Cafe,
      desc: "Cultivé dans plusieurs régions, apprécié pour son arôme unique.",
    },
    {
      id: 8,
      name: "Cacao",
      category: "Cultures de rente et épices",
      img: Cacao,
      desc: "Matière première du chocolat de qualité.",
    },

    // Cultures fruitières
    {
      id: 9,
      name: "Litchi",
      category: "Cultures fruitières",
      img: Litchi,
      desc: "Fruit phare de Madagascar, exporté chaque année.",
    },
    {
      id: 10,
      name: "Mangue",
      category: "Cultures fruitières",
      img: Mangue,
      desc: "Fruit tropical apprécié pour sa chair sucrée.",
    },
    {
      id: 11,
      name: "Banane",
      category: "Cultures fruitières",
      img: Banane,
      desc: "Source naturelle d'énergie et riche en nutriments.",
    },
    {
      id: 12,
      name: "Orange",
      category: "Cultures fruitières",
      img: Orange,
      desc: "Agrume riche en vitamine C et très rafraîchissant.",
    },
  ];

  return (
    <div className="w-full px-4 py-10 h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Plateforme Agricole
        </h1>

        <p className="text-white/70 max-w-3xl mx-auto">
          Découvrez les principales productions agricoles de Madagascar :
          cultures maraîchères, cultures fruitières et cultures de rente.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: idx * 0.08,
            }}
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="h-52 overflow-hidden">
              <img
                src={card.img}
                alt={card.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-5">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                {card.category}
              </span>

              <h3 className="text-xl font-bold mb-2">
                {card.name}
              </h3>

              <p className="text-sm text-white/70 mb-4">
                {card.desc}
              </p>

              <button className="text-green-400 font-semibold hover:underline">
                Découvrir →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Agricol;