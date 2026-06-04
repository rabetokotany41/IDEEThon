import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

import colors from "../../components/common/colors";
import Agricol1 from "../../assets/images/agricol1.jpeg";
import Agricol2 from "../../assets/images/agricol2.jpeg";
import Agricol3 from "../../assets/images/agricol3.jpeg";
import Agricol4 from "../../assets/images/agricol4.jpeg";
import Logo from "../../assets/images/farming.jpeg";
import Contact from "../public/Contact";
import AgricoL from "../public/Agricol";

const Home: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<"en" | "fr">("en");

  const menuRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      id: 0,
      title: "Maïs biologique",
      location: "Madagascar - Hautes terres",
      image: Agricol1,
    },
    {
      id: 1,
      title: "Rizières traditionnelles",
      location: "Antananarivo - Région Analamanga",
      image: Agricol2,
    },
    {
      id: 2,
      title: "Culture de tomates",
      location: "Itasy - Zones agricoles",
      image: Agricol3,
    },
    {
      id: 3,
      title: "Plantation de légumes",
      location: "Vakinankaratra - Fermes locales",
      image: Agricol4,
    },
    {
      id: 4,
      title: "Agriculture durable",
      location: "Coopératives rurales - Madagascar",
      image: Agricol1,
    },
  ];
  const activeData = cards[activeCard];

  // translations
  const t = {
    en: {
      explore: "Explore",
      connect: "Sign in",
      register: "Sign up",
      marketplace: "Marketplace",
      contact: "Contact",
    },
    fr: {
      explore: "Explorer",
      connect: "Se connecter",
      register: "S'inscrire",
      marketplace: "Marché",
      contact: "Contact",
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden text-white"
      style={{ backgroundColor: colors.primaryDark }}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <motion.img
          key={activeData.image}
          src={activeData.image}
          className="w-full h-full object-cover opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* HEADER */}
      <header className="absolute top-0 w-full h-24 z-20 flex items-center justify-between px-8 md:px-[10%]">
        {/* LOGO */}
        <div className="flex items-center gap-2 text-xl font-serif">
          <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          AgriConnect
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-10 text-sm uppercase">
          <Link to="/">Home</Link>
          <Link to="/agricol" className="text-white/60">AGRICOL</Link>
          <Link to="/contact" className="text-white/60">CONTACT</Link>
        </nav>

        {/* MENU */}
        <div ref={menuRef} className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-52 p-4 rounded-lg"
                style={{ backgroundColor: colors.primaryDark }}
              >
                <ul className="flex flex-col gap-3 text-sm">
                  <li>{t[lang].connect}</li>
                  <li>{t[lang].register}</li>
                  <li>{t[lang].marketplace}</li>
                  <li>{t[lang].contact}</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* SOCIAL + LANGUAGE */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10%] z-20 hidden md:flex flex-col items-center gap-8">

        <a href="#"><FaFacebook /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaTwitter /></a>

        <div className="mt-10 flex flex-col items-center gap-3 text-sm border-t border-white/30 pt-4">

          <button
            onClick={() => setLang("en")}
            className={`transition ${lang === "en" ? "text-green-300 font-bold" : "opacity-60"}`}
          >
            EN
          </button>

          <button
            onClick={() => setLang("fr")}
            className={`transition ${lang === "fr" ? "text-green-300 font-bold" : "opacity-60"}`}
          >
            FR
          </button>

        </div>
      </div>

      {/* DOTS LEFT */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20 ml-12">
        {cards.map((_, index) => {
          const isActive = activeCard === index;

          return (
            <button key={index} onClick={() => setActiveCard(index)}>
              <div
                className={`rounded-full transition-all duration-300 ${isActive
                  ? "w-5 h-5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40"
                  }`}
              />
            </button>
          );
        })}
      </div>

      {/* MAIN TEXT */}
      <main className="relative z-10 h-screen flex flex-col justify-center px-8 md:px-[20%]">
        <motion.div
          key={activeCard}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-7xl opacity-40 font-serif mb-4">
            {String(activeData.id + 1).padStart(2, "0")}
          </h2>

          <h1 className="text-4xl md:text-6xl font-serif mb-2">
            {activeData.title}
          </h1>

          <p className="text-white/70 mb-8">
            {activeData.location}
          </p>

          <button className="px-8 py-3 border border-white/50 uppercase text-sm hover:bg-white hover:text-black transition">
            {t[lang].explore}
          </button>
        </motion.div>
      </main>

      {/* CARDS */}
      <div className="absolute bottom-0 w-full z-20 flex gap-4 px-6 md:px-[20%] pb-6 overflow-x-auto">
        {cards.map((card, index) => {
          const isActive = activeCard === index;

          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveCard(index)}
              className={`cursor-pointer flex shrink-0 rounded-xl overflow-hidden transition-all ${isActive
                ? "w-72 bg-white text-black p-3"
                : "w-48 bg-white/10 text-white p-2 border border-white/10"
                }`}
            >
              <img src={card.image} className="w-16 h-16 object-cover rounded-lg" />

              <div className="ml-3">
                <h3 className="text-sm font-bold">{card.title}</h3>
                <p className="text-xs opacity-70">{card.location}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;