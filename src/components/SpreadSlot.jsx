import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardArt } from './CardArt';
import { Sparkles, Eye, X, ZoomIn, Compass } from 'lucide-react';
import { audio } from '../utils/audio';

export const SpreadSlot = ({ 
  slotIndex, 
  positionInfo, 
  card, 
  onCardClick, 
  onRemoveCard, 
  isActive = false, 
  size = 'md', 
  isCrossing = false, 
  showLabel = true 
}) => {
  const sizeClasses = {
    sm: 'w-24 sm:w-28 md:w-32 lg:w-36',
    md: 'w-32 sm:w-40 md:w-48 lg:w-52',
    lg: 'w-44 sm:w-56 md:w-64',
  }[size] || 'w-32 sm:w-40 md:w-48 lg:w-52';

  const isMiniArt = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="flex flex-col items-center group/slot">
      {/* Position Header Label */}
      {showLabel && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-3 text-center flex flex-col items-center ${
            isLarge 
              ? 'max-w-lg sm:max-w-xl' 
              : size === 'md' 
                ? 'max-w-[260px] sm:max-w-[300px]' 
                : 'max-w-[140px]'
          }`}
        >
          {/* Main Position Badge */}
          <div className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-purple-950/85 border border-amber-500/40 text-amber-300 font-cinzel font-semibold shadow-md
            ${isLarge 
              ? 'px-4 py-1 text-xs md:text-sm font-bold tracking-wide' 
              : size === 'md' 
                ? 'px-3 py-0.5 text-[11px] md:text-xs' 
                : 'px-2 py-0.5 text-[10px] truncate max-w-full'
            }
          `}>
            <span>{positionInfo.name}</span>
          </div>

          {/* Subtitle with expanding hover animation */}
          {positionInfo.subtitle && size !== 'sm' && (
            <div className="relative group/sub mt-1.5 px-3 py-0.5 cursor-default inline-flex flex-col items-center text-center">
              <span className={`text-slate-300 font-cinzel font-normal tracking-wide transition-all duration-300 group-hover/sub:text-amber-200
                ${isLarge ? 'text-xs sm:text-sm' : 'text-[11px]'}
              `}>
                {positionInfo.subtitle}
              </span>
              
              {/* Dynamic Animated Line Expanding to the Right on Hover */}
              <div className="w-full h-[1.5px] mt-1 bg-purple-900/40 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-purple-400 origin-left scale-x-0 group-hover/sub:scale-x-100 transition-transform duration-500 ease-out shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Main Slot Frame */}
      <div className={`relative ${sizeClasses} aspect-[2/3] perspective-1000 ${isCrossing ? 'rotate-[-6deg]' : ''}`}>
        <AnimatePresence mode="wait">
          {card ? (
            /* Filled State: Revealed Card with Realistic 3D Flip */
            <motion.div
              key={`filled-${card.id}`}
              initial={{ rotateY: 180, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -6, 
                scale: 1.03, 
                transition: { type: "spring", stiffness: 400, damping: 20 } 
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onCardClick && onCardClick(card, positionInfo)}
              className="w-full h-full cursor-pointer relative transform-gpu"
            >
              {/* Ambient Aura */}
              <div className="absolute -inset-2 rounded-2xl bg-amber-500/20 blur-xl opacity-0 group-hover/slot:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Card Content */}
              <CardArt card={card} isMini={isMiniArt} showKeywords={!isMiniArt} />

              {/* Crossing Tag if applicable */}
              {isCrossing && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-red-950/95 border border-red-500/50 text-[9px] font-cinzel text-red-300 font-bold uppercase tracking-wider z-20 shadow-lg">
                  Cruzamento
                </div>
              )}

              {/* Quick Inspect Hover Overlay Button */}
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200 rounded-xl flex flex-col items-center justify-center gap-1.5 p-2 pointer-events-none z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover/slot:scale-100 transition-transform">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-cinzel text-amber-200 font-semibold tracking-wide">
                  Ver Detalhes
                </span>
              </div>

              {/* Remove Card Button */}
              {onRemoveCard && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    audio.playRemoveCard();
                    onRemoveCard(slotIndex);
                  }}
                  title="Remover carta da posição"
                  className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 border border-red-500/50 text-red-400 hover:bg-red-950 hover:text-red-200 flex items-center justify-center shadow-md transition-colors z-30 cursor-pointer"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </motion.div>
          ) : (
            /* Empty State: Altar Receptor Slot with Soft Pulse */
            <motion.div
              key="empty"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 sm:p-3 text-center transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(251,191,36,0.35)] animate-gold-pulse' 
                  : 'border-purple-500/30 bg-purple-950/20 hover:border-amber-400/50'
                }
              `}
            >
              {/* Sacred Constellation Background Watermark */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-300 p-2">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <polygon points="50,15 80,75 20,75" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <polygon points="50,85 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </svg>
              </div>

              {/* Pulsing Aura Indicator */}
              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mb-1.5 transition-all
                ${isActive 
                  ? 'bg-amber-400/20 text-amber-300 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                  : 'bg-purple-900/40 text-purple-400'
                }
              `}>
                <Sparkles className={`w-4 h-4 ${isActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </div>

              <span className="font-cinzel text-[10px] sm:text-xs text-amber-200/90 font-semibold mb-0.5">
                {isLarge ? 'Carta Focal' : `Slot ${slotIndex + 1}`}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 leading-tight px-1 truncate max-w-full">
                {isActive ? 'Escolha no baralho' : (positionInfo.name.split('.')[1] || positionInfo.name)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
