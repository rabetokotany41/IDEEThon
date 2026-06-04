import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import colors from "../../components/common/colors";
import Agricol1 from "../../assets/images/agricol1.jpeg";
import Agricol2 from "../../assets/images/agricol2.jpeg";
import Agricol3 from "../../assets/images/agricol3.jpeg";
import Agricol4 from "../../assets/images/agricol4.jpeg";
import Logo from "../../assets/images/farming.jpeg";

import Contact from "./Contact";
import Agricol from "./Agricol";
import Connexion from "../../components/layout/Auth/Login";
import Inscription from "../../components/layout/Auth/Resisteur";
import ForgotPassword from "../../components/layout/Auth/ForgotPassword";

type Page = "home" | "agricol" | "contact" | "login" | "register" | "forgot-password";

const Home: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [activePage, setActivePage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [carouselTranslate, setCarouselTranslate] = useState<number>(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselInnerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const cards = [
    { id: 0, title: "Maïs biologique", location: "Madagascar - Hautes terres", image: Agricol1 },
    { id: 1, title: "Rizières traditionnelles", location: "Antananarivo - Région Analamanga", image: Agricol2 },
    { id: 2, title: "Culture de tomates", location: "Itasy - Zones agricoles", image: Agricol3 },
    { id: 3, title: "Plantation de légumes", location: "Vakinankaratra - Fermes locales", image: Agricol4 },
    { id: 4, title: "Agriculture durable", location: "Coopératives rurales - Madagascar", image: Agricol1 },
  ];
  const activeData = cards[activeCard];

  const t = {
    en: {
      explore: "Explore",
      connect: "Login",
      register: "Register",
      marketplace: "Agricol",
      contact: "Contact",
      home: "Home",
      forgot: "Forgot Password",
    },
    fr: {
      explore: "Explorer",
      connect: "Connexion",
      register: "S'inscrire",
      marketplace: "Agricol",
      contact: "Contact",
      home: "Accueil",
      forgot: "Mot de passe oublié",
    },
  };

  // Fermeture du menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calcul de la translation du carrousel
  const updateCarouselTranslation = useCallback(() => {
    if (!carouselWrapperRef.current || !carouselInnerRef.current) return;
    const wrapper = carouselWrapperRef.current;
    const inner = carouselInnerRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    const totalWidth = innerRect.width;
    const visibleWidth = wrapperRect.width;
    if (totalWidth <= visibleWidth) {
      setCarouselTranslate(0);
      return;
    }
    const activeElement = inner.children[activeCard] as HTMLElement;
    if (!activeElement) return;
    const activeRect = activeElement.getBoundingClientRect();
    const wrapperLeft = wrapperRect.left;
    const activeLeft = activeRect.left;
    const activeCenter = activeLeft + activeRect.width / 2;
    const targetCenter = wrapperLeft + visibleWidth / 2;
    let offset = targetCenter - activeCenter;
    const minOffset = visibleWidth - totalWidth;
    const maxOffset = 0;
    offset = Math.min(maxOffset, Math.max(minOffset, offset));
    setCarouselTranslate(offset);
  }, [activeCard]);

  useEffect(() => {
    if (activePage === "home") {
      updateCarouselTranslation();
      window.addEventListener("resize", updateCarouselTranslation);
      return () => window.removeEventListener("resize", updateCarouselTranslation);
    }
  }, [activePage, activeCard, updateCarouselTranslation]);

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  // Navigation clavier (flèches gauche/droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePage !== "home") return;
      if (e.key === "ArrowLeft") {
        setActiveCard((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveCard((prev) => Math.min(cards.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, cards.length]);

  // Swipe tactile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) setActiveCard((prev) => Math.max(0, prev - 1));
        else setActiveCard((prev) => Math.min(cards.length - 1, prev + 1));
      }
    };
    const wrapper = carouselWrapperRef.current;
    if (wrapper && activePage === "home") {
      wrapper.addEventListener("touchstart", handleTouchStart);
      wrapper.addEventListener("touchend", handleTouchEnd);
      return () => {
        wrapper.removeEventListener("touchstart", handleTouchStart);
        wrapper.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [activePage, cards.length]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col">
      {/* IMAGE DE FOND ANIMÉE (z-index 0) */}
      <AnimatePresence mode="wait">
        <div key={activeData.image} className="absolute inset-0 z-0 pointer-events-none">
          <motion.img
            src={activeData.image}
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </AnimatePresence>

      {/* HEADER (z-index 30) */}
      <header className="absolute top-0 w-full h-24 z-30 flex items-center justify-between px-8 md:px-[10%] bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xl font-serif cursor-pointer" onClick={() => handleNavClick("home")}>
          <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          AgriConnect
        </div>

        <nav className="hidden md:flex gap-10 text-sm uppercase items-center">
          <button onClick={() => handleNavClick("home")} className={`transition ${activePage === "home" ? "text-green-300 font-bold" : "hover:text-green-300"}`}>
            {t[lang].home}
          </button>
          <button onClick={() => handleNavClick("agricol")} className={`transition ${activePage === "agricol" ? "text-green-300 font-bold" : "text-white/60 hover:text-green-300"}`}>
            {t[lang].marketplace}
          </button>
          <button onClick={() => handleNavClick("contact")} className={`transition ${activePage === "contact" ? "text-green-300 font-bold" : "text-white/60 hover:text-green-300"}`}>
            {t[lang].contact}
          </button>
          <button onClick={() => handleNavClick("login")} className="px-5 py-2 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold transition">
            {t[lang].connect}
          </button>
        </nav>

        <div ref={menuRef} className="relative md:hidden z-40">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={24} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-52 p-4 rounded-lg shadow-xl border border-white/10"
                style={{ backgroundColor: colors.primaryDark }}
              >
                <ul className="flex flex-col gap-4 text-sm">
                  <li><button onClick={() => handleNavClick("home")} className="hover:text-green-300 transition block text-left w-full">{t[lang].home}</button></li>
                  <li><button onClick={() => handleNavClick("agricol")} className="hover:text-green-300 transition block text-left w-full">{t[lang].marketplace}</button></li>
                  <li><button onClick={() => handleNavClick("contact")} className="hover:text-green-300 transition block text-left w-full">{t[lang].contact}</button></li>
                  <div className="w-full h-px bg-white/20 my-1"></div>
                  <li><button onClick={() => handleNavClick("login")} className="hover:text-green-300 transition block text-left w-full">{t[lang].connect}</button></li>
                  <li><button onClick={() => handleNavClick("register")} className="text-green-400 font-bold hover:text-green-300 transition block text-left w-full">{t[lang].register}</button></li>
                  <li><button onClick={() => handleNavClick("forgot-password")} className="hover:text-green-300 transition block text-left w-full opacity-70">{t[lang].forgot}</button></li>
                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setLang("en")} className={`text-xs ${lang === "en" ? "text-green-300" : "opacity-60"}`}>EN</button>
                    <button onClick={() => setLang("fr")} className={`text-xs ${lang === "fr" ? "text-green-300" : "opacity-60"}`}>FR</button>
                  </div>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* SOCIAL + LANGUE (z-index 20) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-6 bg-black/40 backdrop-blur-sm rounded-full py-6 px-3 border border-white/20">
        <a href="#" className="hover:text-green-300 transition"><FaFacebook size={18} /></a>
        <a href="#" className="hover:text-green-300 transition"><FaInstagram size={18} /></a>
        <a href="#" className="hover:text-green-300 transition"><FaTwitter size={18} /></a>
        <div className="w-6 h-px bg-white/30 my-2" />
        <button onClick={() => setLang("en")} className={`text-xs font-medium ${lang === "en" ? "text-green-300" : "opacity-60 hover:opacity-100"}`}>EN</button>
        <button onClick={() => setLang("fr")} className={`text-xs font-medium ${lang === "fr" ? "text-green-300" : "opacity-60 hover:opacity-100"}`}>FR</button>
      </div>

      {/* DOTS VERTICAUX (z-index 20) */}
      {activePage === "home" && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3 text-white rounded-full bg-black/40 px-3 py-4 backdrop-blur-md border border-white/20 shadow-lg">
          <button onClick={() => setActiveCard((prev) => Math.max(0, prev - 1))} className="p-1 cursor-pointer hover:text-green-400 transition">
          </button>
          <div className="flex flex-col items-center gap-2">
            {cards.map((_, i) => (
              <div key={i} onClick={() => setActiveCard(i)} className={`rounded-full cursor-pointer transition-all duration-300 ${activeCard === i ? "h-6 w-2 bg-green-400" : "h-2 w-2 bg-white/30 hover:bg-white/70"}`} />
            ))}
          </div>
          <button onClick={() => setActiveCard((prev) => Math.min(cards.length - 1, prev + 1))} className="p-1 cursor-pointer hover:text-green-400 transition">
          </button>
        </div>
      )}

      {/* MAIN CONTENT (z-index 10, avec un fond transparent pour lisibilité) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-[20%] overflow-y-auto pb-32 pt-24 h-full bg-black/20 backdrop-blur-[2px]">
        {activePage === "home" && (
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h2 className="text-7xl opacity-40 font-serif mb-4">{String(activeData.id + 1).padStart(2, "0")}</h2>
            <h1 className="text-4xl md:text-6xl font-serif mb-2 drop-shadow-lg">{activeData.title}</h1>
            <p className="text-white/80 mb-8 drop-shadow-md">{activeData.location}</p>
            <button className="px-8 py-3 border border-white/50 uppercase text-sm hover:bg-white hover:text-black transition backdrop-blur-sm">
              {t[lang].explore}
            </button>
          </motion.div>
        )}

        {activePage === "agricol" && <Agricol />}
        {activePage === "contact" && <Contact />}
        {activePage === "login" && <Connexion onNavigate={(p: Page) => setActivePage(p)} />}
        {activePage === "register" && <Inscription onNavigate={(p: Page) => setActivePage(p)} />}
        {activePage === "forgot-password" && <ForgotPassword onNavigate={(p: Page) => setActivePage(p)} />}
      </main>

      {/* CARROUSEL 3D (z-index 20) */}
      <AnimatePresence>
        {activePage === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 w-full z-20 flex flex-col items-center select-none"
          >
            <div
              ref={carouselWrapperRef}
              className="w-full overflow-hidden"
            >
              <motion.div
                ref={carouselInnerRef}
                className="flex gap-6 md:gap-10 justify-center items-center"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                {cards.map((card, i) => {
                  const isActive = activeCard === i;
                  const angle = (activeCard - i) * 35;
                  const scale = isActive ? 1 : 0.85;
                  const translateZ = isActive ? 40 : 0;

                  return (
                    <div
                      key={card.id}
                      data-index={i}
                      className="perspective-1000"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="w-44 md:w-64 aspect-[4/3] flex flex-col items-center gap-3 cursor-pointer"
                        animate={{
                          rotateY: angle,
                          scale: scale,
                          z: translateZ,
                        }}
                        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                        onClick={() => setActiveCard(i)}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/30"
                        />
                        <motion.div
                          className="text-xs md:text-sm font-bold text-white whitespace-nowrap text-center px-2"
                          animate={{
                            opacity: isActive ? 1 : 0,
                            filter: isActive ? "blur(0px)" : "blur(4px)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {card.title}
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;