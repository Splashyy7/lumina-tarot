import React from 'react';
import { 
  Sparkles, Flame, Droplets, Wind, Mountain, 
  Sun, Moon, Star, Compass, Shield, Award, 
  Crown, Heart, Feather, Zap, Eye, RefreshCw, Key
} from 'lucide-react';
import { SUITS } from '../data/tarotDeck';

export const CardArt = ({ card, isMini = false, showKeywords = true }) => {
  const suitConfig = SUITS[card.suit.toUpperCase()] || SUITS.MAJOR;

  // Custom symbolic graphic generator based on card archetype
  const renderCardSymbolism = () => {
    // 1. Major Arcana specific sacred illustrations
    if (card.arcana === 'Major') {
      switch (card.number) {
        case 0: // O Louco
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 20 85 Q 50 65 80 85" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="50" cy="35" r="12" fill="#FDE68A" opacity="0.3" />
              <path d="M 50 20 L 50 45 M 35 30 L 65 30" stroke="#FBBF24" strokeWidth="1.5" />
              <path d="M 50 50 L 58 75 L 42 75 Z" fill="#C084FC" opacity="0.6" />
              <circle cx="70" cy="30" r="4" fill="#FDE68A" />
              <path d="M 68 22 L 72 38 M 62 30 L 78 30" stroke="#F59E0B" strokeWidth="1" />
            </svg>
          );
        case 1: // O Mago
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
              {/* Lemniscata (Infinity) */}
              <path d="M 35 30 C 25 20, 25 40, 35 30 C 45 20, 55 40, 65 30 C 75 20, 75 40, 65 30 C 55 20, 45 40, 35 30" fill="none" stroke="#FBBF24" strokeWidth="2" />
              {/* Altar with 4 elements */}
              <rect x="30" y="60" width="40" height="15" rx="3" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="38" cy="55" r="3" fill="#38BDF8" /> {/* Cup */}
              <line x1="45" y1="52" x2="45" y2="58" stroke="#F97316" strokeWidth="2" /> {/* Wand */}
              <line x1="55" y1="52" x2="55" y2="58" stroke="#E2E8F0" strokeWidth="1.5" /> {/* Sword */}
              <circle cx="63" cy="55" r="3" fill="#34D399" /> {/* Pentacle */}
              <line x1="50" y1="40" x2="50" y2="52" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          );
        case 2: // A Sacerdotisa
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Pillars B & J */}
              <rect x="20" y="25" width="10" height="55" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <rect x="70" y="25" width="10" height="55" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              <text x="25" y="55" fill="#CBD5E1" fontSize="8" textAnchor="middle" fontWeight="bold">B</text>
              <text x="75" y="55" fill="#0F172A" fontSize="8" textAnchor="middle" fontWeight="bold">J</text>
              {/* Moon Crescent Veil */}
              <path d="M 35 30 Q 50 45 65 30 Q 50 80 35 30" fill="#312E81" opacity="0.6" stroke="#818CF8" strokeWidth="1" />
              <path d="M 45 40 A 10 10 0 0 0 55 60 A 12 12 0 0 1 45 40" fill="#FDE68A" />
            </svg>
          );
        case 10: // Roda da Fortuna
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 animate-[spin_40s_linear_infinite]">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="10" fill="#1E1B4B" stroke="#FDE68A" strokeWidth="1.5" />
              {/* 8 spokes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line 
                  key={i}
                  x1="50" y1="50" 
                  x2={50 + 36 * Math.cos((angle * Math.PI) / 180)} 
                  y2={50 + 36 * Math.sin((angle * Math.PI) / 180)} 
                  stroke="#FBBF24" 
                  strokeWidth="1.5" 
                />
              ))}
            </svg>
          );
        case 17: // A Estrela
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300">
              <polygon points="50,15 54,38 78,38 58,52 65,75 50,60 35,75 42,52 22,38 46,38" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="28" cy="25" r="3" fill="#67E8F9" opacity="0.8" />
              <circle cx="72" cy="25" r="3" fill="#67E8F9" opacity="0.8" />
              <circle cx="20" cy="65" r="2.5" fill="#67E8F9" opacity="0.8" />
              <circle cx="80" cy="65" r="2.5" fill="#67E8F9" opacity="0.8" />
              {/* Water streams */}
              <path d="M 40 70 Q 30 85 20 85 M 60 70 Q 70 85 80 85" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          );
        case 19: // O Sol
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="20" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="50" cy="50" r="16" fill="#FDE68A" />
              {/* Sun rays */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <path
                  key={i}
                  d={`M ${50 + 24 * Math.cos((angle * Math.PI) / 180)} ${50 + 24 * Math.sin((angle * Math.PI) / 180)} L ${50 + 38 * Math.cos((angle * Math.PI) / 180)} ${50 + 38 * Math.sin((angle * Math.PI) / 180)}`}
                  stroke={i % 2 === 0 ? '#F59E0B' : '#FBBF24'}
                  strokeWidth={i % 2 === 0 ? '3' : '1.5'}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          );
        case 21: // O Mundo
          return (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Laurel Wreath */}
              <ellipse cx="50" cy="50" rx="34" ry="38" fill="none" stroke="#34D399" strokeWidth="3" strokeDasharray="6 3" />
              <circle cx="50" cy="50" r="22" fill="#312E81" opacity="0.6" stroke="#FBBF24" strokeWidth="1.5" />
              {/* 4 Kerubs symbols in corners */}
              <circle cx="18" cy="18" r="4" fill="#FDE68A" />
              <circle cx="82" cy="18" r="4" fill="#38BDF8" />
              <circle cx="18" cy="82" r="4" fill="#F97316" />
              <circle cx="82" cy="82" r="4" fill="#34D399" />
              <path d="M 50 38 L 50 62 M 40 48 L 60 48" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          );
        default:
          return (
            <div className="flex flex-col items-center justify-center h-full text-center px-2">
              <div className="relative mb-2">
                <Sparkles className="w-10 h-10 text-amber-400 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
              </div>
              <span className="text-[11px] font-cinzel text-amber-200/90 tracking-wider uppercase font-semibold">
                {card.archetype}
              </span>
            </div>
          );
      }
    }

    // 2. Minor Arcana Suits Visual Representations
    if (card.suit === 'wands') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md"></div>
            <Flame className="w-10 h-10 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)] relative z-10" />
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: Math.min(card.number || 1, 5) }).map((_, i) => (
              <div key={i} className="w-1.5 h-6 bg-gradient-to-t from-amber-600 to-orange-400 rounded-full"></div>
            ))}
          </div>
        </div>
      );
    }

    if (card.suit === 'cups') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md"></div>
            <Droplets className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)] relative z-10" />
          </div>
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: Math.min(card.number || 1, 5) }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_rgba(56,189,248,0.8)]"></div>
            ))}
          </div>
        </div>
      );
    }

    if (card.suit === 'swords') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md"></div>
            <Wind className="w-10 h-10 text-slate-200 drop-shadow-[0_0_10px_rgba(226,232,240,0.6)] relative z-10" />
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: Math.min(card.number || 1, 5) }).map((_, i) => (
              <div key={i} className="w-1 h-7 bg-gradient-to-t from-slate-600 via-slate-300 to-white rounded-t-sm"></div>
            ))}
          </div>
        </div>
      );
    }

    if (card.suit === 'pentacles') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md"></div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300/40" />
            </div>
          </div>
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: Math.min(card.number || 1, 5) }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-emerald-500/40"></div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`relative w-full h-full rounded-xl flex flex-col justify-between overflow-hidden border bg-gradient-to-b ${suitConfig.bgGradient} ${suitConfig.borderGlow} transition-all duration-300 select-none shadow-2xl`}>
      {/* Background Sacred Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* Ornate Gold Frame Border */}
      <div className="absolute inset-1.5 rounded-lg border border-amber-500/30 pointer-events-none">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-400" />
      </div>

      {/* Header: Roman Numeral / Rank & Element Indicator */}
      <div className="relative z-10 px-3 pt-2.5 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-cinzel text-xs md:text-sm font-bold text-amber-300 tracking-wider">
            {card.roman}
          </span>
        </div>
        
        <span 
          className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-400/20 bg-slate-900/60 font-medium"
          style={{ color: suitConfig.color }}
        >
          {card.arcana === 'Major' ? 'Arcano Maior' : suitConfig.element}
        </span>
      </div>

      {/* Main Center Artwork */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-2">
        {renderCardSymbolism()}
      </div>

      {/* Footer: Card Name & Keywords */}
      <div className="relative z-10 px-2.5 pb-2.5 pt-1 text-center bg-slate-950/80 backdrop-blur-sm border-t border-amber-500/20">
        <h4 className="font-cinzel text-xs md:text-sm font-bold text-slate-100 leading-tight truncate tracking-wide">
          {card.name}
        </h4>
        
        {!isMini && (
          <p className="text-[10px] text-amber-300/80 font-cinzel truncate mt-0.5">
            {card.nameEn}
          </p>
        )}

        {showKeywords && !isMini && card.keywords && (
          <div className="mt-1.5 flex flex-wrap justify-center gap-1 overflow-hidden max-h-5">
            {card.keywords.slice(0, 2).map((kw, i) => (
              <span key={i} className="text-[8.5px] px-1.5 py-0.2 rounded-full bg-purple-950/80 text-purple-200 border border-purple-500/30 truncate">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
