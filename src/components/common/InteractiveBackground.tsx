import React, { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  thickness: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  particles: { x: number; y: number; vx: number; vy: number }[];
}

interface ElectricArc {
  active: boolean;
  points: { x: number; y: number }[];
  branches: { points: { x: number; y: number }[] }[];
  intensity: number;
  life: number;
}

const RainWithElectricity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  const drops = useRef<Drop[]>([]);
  const splashes = useRef<Splash[]>([]);
  const electricArcs = useRef<ElectricArc[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const MAX_DROPS = 800;
  const WIND_FORCE = 0.6; // léger vent pour la pluie
  let lastElectricTime = 0;
  let time = 0;

  const createDrop = (w: number, h: number): Drop => ({
    x: Math.random() * w,
    y: Math.random() * h,
    len: Math.random() * 30 + 12,
    speed: Math.random() * 8 + 6, // un peu plus lent
    opacity: Math.random() * 0.6 + 0.3,
    thickness: Math.random() * 1.5 + 0.8,
  });

  const createSplash = (x: number, y: number): Splash => {
    const particles = [];
    const count = Math.floor(Math.random() * 8) + 5;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y - 3,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
      });
    }
    return {
      x,
      y,
      radius: 3 + Math.random() * 5,
      alpha: 0.8,
      particles,
    };
  };

  const init = (w: number, h: number) => {
    drops.current = Array.from({ length: MAX_DROPS }, () => createDrop(w, h));
  };

  // Génère un arc électrique entre deux points (départ et arrivée)
  const generateElectricArc = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    intensity = 1.0
  ): ElectricArc => {
    const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
    const segments = 12;
    const dx = endX - startX;
    const dy = endY - startY;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      // Position de base linéaire
      let x = startX + dx * t;
      let y = startY + dy * t;
      // Ajout de perturbations aléatoires (plus fortes au milieu)
      const perturbation = Math.sin(Math.PI * t) * (Math.random() - 0.5) * 60;
      const angle = Math.atan2(dy, dx);
      const perpX = -Math.sin(angle) * perturbation;
      const perpY = Math.cos(angle) * perturbation;
      x += perpX;
      y += perpY;
      points.push({ x, y });
    }

    // Branches électriques (secondaires)
    const branches: { points: { x: number; y: number }[] }[] = [];
    for (let i = 2; i < points.length - 1; i++) {
      if (Math.random() < 0.4) {
        const branchPoints: { x: number; y: number }[] = [{ x: points[i].x, y: points[i].y }];
        let branchX = points[i].x;
        let branchY = points[i].y;
        const branchLength = Math.floor(Math.random() * 5) + 3;
        // direction aléatoire pour la branche
        const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI / 1.5;
        const step = 12;
        for (let j = 0; j < branchLength; j++) {
          branchX += Math.cos(branchAngle) * step * (Math.random() * 0.8 + 0.5);
          branchY += Math.sin(branchAngle) * step * (Math.random() * 0.8 + 0.5);
          branchPoints.push({ x: branchX, y: branchY });
        }
        branches.push({ points: branchPoints });
      }
    }

    return {
      active: true,
      points,
      branches,
      intensity,
      life: 0.8, // durée de vie plus longue (secondes)
    };
  };

  // Ajoute un arc électrique aléatoire qui se balade dans l'écran
  const addWanderingElectricArc = (w: number, h: number) => {
    // Choisir deux points aléatoires : soit sur les bords, soit à l'intérieur
    const startSide = Math.floor(Math.random() * 4); // 0: haut, 1: droite, 2: bas, 3: gauche
    let startX, startY;
    if (startSide === 0) { startX = Math.random() * w; startY = 0; }
    else if (startSide === 1) { startX = w; startY = Math.random() * h; }
    else if (startSide === 2) { startX = Math.random() * w; startY = h; }
    else { startX = 0; startY = Math.random() * h; }

    const endSide = (startSide + 1 + Math.floor(Math.random() * 3)) % 4; // autre côté
    let endX, endY;
    if (endSide === 0) { endX = Math.random() * w; endY = 0; }
    else if (endSide === 1) { endX = w; endY = Math.random() * h; }
    else if (endSide === 2) { endX = Math.random() * w; endY = h; }
    else { endX = 0; endY = Math.random() * h; }

    const intensity = 0.8 + Math.random() * 0.5;
    const arc = generateElectricArc(startX, startY, endX, endY, intensity);
    electricArcs.current.push(arc);
  };

  // Ajoute un arc depuis la souris vers un point aléatoire (pour l'interaction)
  const addElectricArcFromMouse = (x: number, y: number, w: number, h: number) => {
    // Point d'arrivée aléatoire sur un bord
    const endSide = Math.floor(Math.random() * 4);
    let endX, endY;
    if (endSide === 0) { endX = Math.random() * w; endY = 0; }
    else if (endSide === 1) { endX = w; endY = Math.random() * h; }
    else if (endSide === 2) { endX = Math.random() * w; endY = h; }
    else { endX = 0; endY = Math.random() * h; }
    const intensity = 0.9;
    const arc = generateElectricArc(x, y, endX, endY, intensity);
    electricArcs.current.push(arc);
  };

  const updateElectricArcs = (deltaTime: number) => {
    for (let i = 0; i < electricArcs.current.length; i++) {
      const arc = electricArcs.current[i];
      arc.life -= deltaTime;
      arc.intensity *= 0.96; // diminue très progressivement
      if (arc.life <= 0 || arc.intensity < 0.05) {
        electricArcs.current.splice(i, 1);
        i--;
      }
    }
  };

  const drawElectricArcs = (ctx: CanvasRenderingContext2D) => {
    for (const arc of electricArcs.current) {
      if (!arc.active) continue;

      // Lueur très claire
      ctx.shadowBlur = 18;
      ctx.shadowColor = `rgba(180, 230, 255, ${arc.intensity * 0.9})`;

      // Arc principal (blanc-cyan très lumineux)
      ctx.beginPath();
      ctx.moveTo(arc.points[0].x, arc.points[0].y);
      for (let i = 1; i < arc.points.length; i++) {
        ctx.lineTo(arc.points[i].x, arc.points[i].y);
      }
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(210, 240, 255, ${arc.intensity})`;
      ctx.stroke();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${arc.intensity * 0.95})`;
      ctx.stroke();

      // Branches
      for (const branch of arc.branches) {
        ctx.beginPath();
        ctx.moveTo(branch.points[0].x, branch.points[0].y);
        for (let i = 1; i < branch.points.length; i++) {
          ctx.lineTo(branch.points[i].x, branch.points[i].y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(200, 230, 255, ${arc.intensity * 0.8})`;
        ctx.stroke();
      }

      // Étincelles
      for (const point of arc.points) {
        if (Math.random() < 0.3) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.random() * 2.5 + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 200, ${arc.intensity})`;
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
    }
  };

  const drawElectricFlash = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    let maxIntensity = 0;
    for (const arc of electricArcs.current) {
      if (arc.intensity > maxIntensity) maxIntensity = arc.intensity;
    }
    if (maxIntensity > 0.15) {
  // Flash blanc très doux (plus lumineux)
  ctx.fillStyle = `rgba(240, 250, 255, ${maxIntensity * 0.2})`;
  ctx.fillRect(0, 0, w, h);

  // Voile bleu ciel très léger (effet air frais)
  ctx.fillStyle = `rgba(180, 220, 255, ${maxIntensity * 0.08})`;
  ctx.fillRect(0, 0, w, h);
}
  };

  const updateDrops = (w: number, h: number) => {
    for (const d of drops.current) {
      d.x += WIND_FORCE;
      d.y += d.speed;
      if (d.y > h) {
        splashes.current.push(createSplash(d.x, h - 2));
        d.y = -30 - Math.random() * 40;
        d.x = Math.random() * w;
        d.speed = Math.random() * 8 + 6;
        d.len = Math.random() * 30 + 12;
        d.opacity = Math.random() * 0.6 + 0.3;
      }
      if (d.x < -50) d.x = w + 50;
      if (d.x > w + 50) d.x = -50;
    }
  };

  const updateSplashes = () => {
    for (let i = 0; i < splashes.current.length; i++) {
      const s = splashes.current[i];
      for (let j = 0; j < s.particles.length; j++) {
        const p = s.particles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        if (p.y > s.y + 20) {
          s.particles.splice(j, 1);
          j--;
        }
      }
      s.radius += 0.5;
      s.alpha -= 0.015;
      if (s.alpha <= 0 || (s.particles.length === 0 && s.radius > 15)) {
        splashes.current.splice(i, 1);
        i--;
      }
    }
  };

  const drawRainAndSplashes = (ctx: CanvasRenderingContext2D) => {
    for (const d of drops.current) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1.2, d.y + d.len);
      ctx.strokeStyle = `rgba(160, 210, 255, ${d.opacity})`;
      ctx.lineWidth = d.thickness;
      ctx.stroke();
    }
    for (const s of splashes.current) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 230, 255, ${s.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      for (const p of s.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 240, 255, ${s.alpha * 0.9})`;
        ctx.fill();
      }
    }
  };

  let lastTimestamp = 0;
  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;
    time += delta;

    // Apparition aléatoire d'arcs "baladeurs" (moins fréquente)
    if (Math.random() < 0.008 && timestamp - lastElectricTime > 1.2) {
      addWanderingElectricArc(w, h);
      lastElectricTime = timestamp;
    }

    // Arc depuis la souris (moins fréquent aussi)
    if (mouseRef.current.active && Math.random() < 0.05) {
      addElectricArcFromMouse(mouseRef.current.x, mouseRef.current.y, w, h);
    }

    updateElectricArcs(delta);
    updateDrops(w, h);
    updateSplashes();

    // Fond plus sombre mais avec traînée légère
    ctx.fillStyle = "rgba(3, 6, 14, 0.15)";
    ctx.fillRect(0, 0, w, h);

    drawRainAndSplashes(ctx);
    drawElectricArcs(ctx);
    drawElectricFlash(ctx, w, h);

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
        e.preventDefault();
      }
    };
    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    animate(0);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#02030a] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-wider font-mono bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        ⚡ Électricité qui se balade | pluie + éclaboussures
      </div>
    </div>
  );
};

export default RainWithElectricity;