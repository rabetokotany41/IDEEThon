// InteractiveBackground.tsx
import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const MAX_PARTICLES = 300;
  const SPAWN_ON_CLICK = 8;
  const ATTRACTION_RADIUS = 180;
  const ATTRACTION_FORCE = 0.006;

  // Génère une couleur dans les tons verts/agrumes
  const getParticleColor = () => {
    const hue = Math.random() * 40 + 80; // 80-120 (verts)
    const sat = 70 + Math.random() * 20; // 70-90%
    const light = 55 + Math.random() * 25; // 55-80%
    const alpha = Math.random() * 0.5 + 0.3; // 0.3-0.8
    return `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
  };

  const createParticle = (x: number, y: number): Particle => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    size: Math.random() * 3 + 1.5,
    color: getParticleColor(),
  });

  const initParticles = (count: number, width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(Math.random() * width, Math.random() * height));
    }
    return particles;
  };

  const resizeCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };

    // Ajuster les particules existantes si nécessaire (éviter qu'elles sortent brutalement)
    particlesRef.current.forEach((p) => {
      p.x = Math.min(Math.max(p.x, 0), width);
      p.y = Math.min(Math.max(p.y, 0), height);
    });
  };

  const updateParticles = (width: number, height: number, mouse: typeof mouseRef.current) => {
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Attraction / répulsion selon le clic
      if (mouse.down) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < ATTRACTION_RADIUS * ATTRACTION_RADIUS && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / ATTRACTION_RADIUS) * ATTRACTION_FORCE;
          p.vx += dx * force;
          p.vy += dy * force;
        }
      }

      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Mouvement
      p.x += p.vx;
      p.y += p.vy;

      // Téléportation douce : si sort du canvas, réapparaît de l'autre côté (effet infini)
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (const p of particlesRef.current) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const addParticles = (x: number, y: number, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push(createParticle(x, y));
    }
    const updated = [...particlesRef.current, ...newParticles];
    if (updated.length > MAX_PARTICLES) {
      particlesRef.current = updated.slice(-MAX_PARTICLES);
    } else {
      particlesRef.current = updated;
    }
  };

  const animate = (ctx: CanvasRenderingContext2D, width: number, height: number, mouse: typeof mouseRef.current) => {
    // Effet de traînée (fond sombre mais transparent pour persistance)
    ctx.fillStyle = 'rgba(10, 10, 18, 0.2)';
    ctx.fillRect(0, 0, width, height);

    updateParticles(width, height, mouse);
    drawParticles(ctx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    dimensionsRef.current = { width, height };
    canvas.width = width;
    canvas.height = height;

    // Initialisation des particules (150)
    particlesRef.current = initParticles(150, width, height);
    const mouse = mouseRef.current;

    const handleResize = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
      // Optionnel : repositionner les particules dans les limites
      particlesRef.current.forEach((p) => {
        p.x = Math.min(Math.max(p.x, 0), width);
        p.y = Math.min(Math.max(p.y, 0), height);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        e.preventDefault(); // Empêche le scroll pendant l'interaction
      }
    };

    const handleMouseDown = () => { mouse.down = true; };
    const handleMouseUp = () => { mouse.down = false; };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.down = true;
        e.preventDefault();
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      mouse.down = false;
      e.preventDefault();
    };
    const handleTouchCancel = (e: TouchEvent) => {
      mouse.down = false;
      e.preventDefault();
    };

    const handleClick = (e: MouseEvent) => {
      addParticles(e.clientX, e.clientY, SPAWN_ON_CLICK);
    };

    const animationLoop = () => {
      if (!ctx || !canvas) return;
      animate(ctx, width, height, mouse);
      animationIdRef.current = requestAnimationFrame(animationLoop);
    };
    animationLoop();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#0a0a12] pointer-events-auto">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest pointer-events-none select-none text-center z-10">
        drag to interact &middot; click to spawn
      </div>
    </div>
  );
};

export default InteractiveBackground;