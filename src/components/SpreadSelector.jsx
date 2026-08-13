import React from 'react';
import { motion } from 'framer-motion';
import { SPREAD_TYPES } from '../data/spreads';
import { Layers, Sparkles, Compass, HeartHandshake, PlusCircle } from 'lucide-react';
import { audio } from '../utils/audio';

const ICONS_MAP = {
  Layers,
  Sparkles,
  Compass,
  HeartHandshake,
  PlusCircle,
};

export const SpreadSelector = ({ 
  currentSpread, 
  onSelectSpread 
}) => {
  const handleSelect = (spread) => {
    if (spread.id === currentSpread.id) return;
    audio.playHover();
    onSelectSpread(spread);
  };

  return (
    <nav aria-label="Seletor de Tipo de Tiragem" className="w-full max-w-5xl mx-auto mb-8 px-2 sm:px-4 overflow-visible">
      {/* Mobile: Horizontal scroll without scrollbar | Desktop: Centered flex row, overflow-visible */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 md:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar py-2 px-1 sm:px-0">
        {SPREAD_TYPES.map((spread) => {
          const Icon = ICONS_MAP[spread.icon] || Sparkles;
          const isSelected = spread.id === currentSpread.id;

          return (
            <button
              key={spread.id}
              onClick={() => handleSelect(spread)}
              type="button"
              className={`group relative px-3 sm:px-3.5 md:px-4 py-2 rounded-xl text-xs md:text-sm font-cinzel font-semibold flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors duration-200 cursor-pointer
                ${isSelected
                  ? 'text-amber-300'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/70 border border-purple-900/40 hover:border-purple-500/50 hover:bg-slate-900/90 shadow-sm'
                }
              `}
            >
              {/* Active Tab Floating Pill with Smooth Framer Motion Glide */}
              {isSelected && (
                <motion.div
                  layoutId="activeSpreadIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-950 via-[#1E124A] to-purple-950 border border-amber-400/90 shadow-[0_0_18px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/40 -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 relative z-10 transition-transform group-hover:rotate-12 ${isSelected ? 'text-amber-400' : 'text-purple-400'}`} />
              
              <span className="hidden md:inline relative z-10">{spread.shortName}</span>
              <span className="inline md:hidden relative z-10">{spread.compactName}</span>
              
              {/* Badge for number of cards */}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold shrink-0 relative z-10
                ${isSelected 
                  ? 'bg-amber-400 text-slate-950' 
                  : 'bg-purple-950/90 text-purple-300 border border-purple-800/80'
                }
              `}>
                {spread.cardCount}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
