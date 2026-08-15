import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, FastForward, Sun, Moon } from 'lucide-react';
import { CardArt } from './CardArt';
import { audio } from '../utils/audio';

export const DestinySummonAnimation = ({ 
  cardsToSummon, 
  spreadConfig, 
  onComplete,
  onCancel 
}) => {
  const [phase, setPhase] = useState('meteor'); // 'meteor' | 'burst' | 'cards'
  const canvasRef = useRef(null);

  useEffect(() => {
    // 1. Start Wish Launch Audio
    audio.playWishLaunch();

    // 2. Timeline Orchestration
    const burstTimer = setTimeout(() => {
      setPhase('burst');
      audio.playStarImpact();
    }, 1100);

    const cardsTimer = setTimeout(() => {
      setPhase('cards');
      audio.playCardSummonCascade(cardsToSummon.length);
    }, 1600);

    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete(cardsToSummon);
      }
    }, 3800);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(cardsTimer);
      clearTimeout(completeTimer);
    };
  }, [cardsToSummon, onComplete]);

  // Canvas particle trail for shooting star
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = [];
    let startTime = performance.now();

    const render = (time) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, w, h);

      // During meteor phase (first 1.2s), spawn trailing star particles along diagonal path
      if (elapsed < 1200) {
        const progress = elapsed / 1100;
        const currentX = -50 + progress * (w * 0.75 + 100);
        const currentY = -50 + progress * (h * 0.65 + 100);

        for (let i = 0; i < 4; i++) {
          particles.push({
            x: currentX + (Math.random() - 0.5) * 30,
            y: currentY + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 2 - 3,
            vy: (Math.random() - 0.5) * 2 - 2,
            radius: Math.random() * 3 + 1,
            alpha: 1,
            color: Math.random() > 0.3 ? '#FDE68A' : '#F59E0B'
          });
        }
      }

      // Draw and age particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSkip = () => {
    audio.playSelect();
    if (onComplete) {
      onComplete(cardsToSummon);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl overflow-hidden select-none">
      
      {/* Background Star Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Deep Celestial Nebula Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4C1D95_0%,#0F0728_60%,#03010A_100%)] opacity-90" />

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-cinzel font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
      >
        <FastForward className="w-4 h-4" />
        <span>Pular Destino</span>
      </button>

      {/* ================= PHASE 1: GENSHIN-STYLE SHOOTING METEOR ================= */}
      {phase === 'meteor' && (
        <motion.div
          initial={{ x: '-20vw', y: '-20vh', scale: 0.4, opacity: 0 }}
          animate={{ 
            x: '55vw', 
            y: '45vh', 
            scale: [0.5, 1.3, 1.6],
            opacity: [0, 1, 1] 
          }}
          transition={{ duration: 1.15, ease: [0.12, 0, 0.39, 0] }}
          className="absolute z-20 pointer-events-none flex items-center justify-center"
        >
          {/* Shooting Star Radiant Tail (Gold/Amber/Cyan) */}
          <div className="relative">
            {/* Long comet tail */}
            <div 
              className="absolute -top-12 -left-64 w-80 h-16 origin-right -rotate-45 bg-gradient-to-r from-transparent via-amber-400/60 to-yellow-200 blur-sm rounded-full pointer-events-none" 
            />
            <div 
              className="absolute -top-6 -left-48 w-60 h-8 origin-right -rotate-45 bg-gradient-to-r from-transparent via-purple-400/80 to-white blur-[1px] rounded-full pointer-events-none" 
            />

            {/* Glowing Comet Head */}
            <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_50px_#FDE68A,0_0_100px_#F59E0B] flex items-center justify-center animate-pulse">
              <Star className="w-10 h-10 text-amber-300 fill-amber-200" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= PHASE 2: STARBURST IMPACT EXPLOSION ================= */}
      {(phase === 'burst' || phase === 'cards') && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 4, 8], opacity: [1, 0.8, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute z-20 w-48 h-48 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-purple-600 blur-xl pointer-events-none"
        />
      )}

      {/* ================= PHASE 3: REVEALED CARDS IN CELESTIAL FAN ================= */}
      {phase === 'cards' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-30 flex flex-col items-center max-w-6xl w-full px-4"
        >
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-cinzel font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Conexão Oracular Estabelecida</span>
            </div>
            <h2 className="font-cinzel-dec text-2xl sm:text-4xl md:text-5xl font-black gold-gradient-text tracking-wider">
              O DESTINO RESPONDEU
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 font-cinzel mt-1">
              {cardsToSummon.length} {cardsToSummon.length === 1 ? 'arcano consagrado' : 'arcanos consagrados'} para a tiragem "{spreadConfig.name}"
            </p>
          </motion.div>

          {/* Cards Fan / Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-5xl py-2">
            {cardsToSummon.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.6, rotateZ: (idx - (cardsToSummon.length - 1) / 2) * 4 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateZ: (idx - (cardsToSummon.length - 1) / 2) * 2 }}
                transition={{ 
                  delay: 0.1 + idx * 0.1, 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25 
                }}
                className="w-28 sm:w-36 md:w-44 aspect-[2/3] transform-gpu shadow-[0_0_25px_rgba(251,191,36,0.35)] rounded-xl"
              >
                <CardArt card={card} isMini={cardsToSummon.length > 5} showKeywords={cardsToSummon.length <= 4} />
              </motion.div>
            ))}
          </div>

          {/* Bottom Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              type="button"
              onClick={handleSkip}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-cinzel font-black text-sm tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.6)] active:scale-95 transition-all cursor-pointer"
            >
              Consagrar no Altar & Interpretar
            </button>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};
