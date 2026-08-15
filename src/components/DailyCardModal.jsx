import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Sparkles, Sun, Moon, Star, Calendar, 
  Compass, Feather, Heart, Flame, Shield 
} from 'lucide-react';
import { CardArt } from './CardArt';
import { TAROT_DECK, SUITS } from '../data/tarotDeck';
import { audio } from '../utils/audio';

export const DailyCardModal = ({ 
  isOpen, 
  onClose,
  onOpenCardDetail 
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    audio.playCloseModal();
    onClose();
  };

  // Deterministic Daily Seed calculation based on local date string YYYY-MM-DD
  const dailyCard = useMemo(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Simple hash function for date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0;
    }
    
    const index = Math.abs(hash) % TAROT_DECK.length;
    return TAROT_DECK[index];
  }, []);

  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const suitConfig = SUITS[dailyCard.suit?.toUpperCase()] || SUITS.MAJOR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Outer Click Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
        onClick={handleClose} 
      />

      {/* Modal Dialog Card */}
      <motion.div 
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl glass-panel border border-amber-500/40 shadow-2xl overflow-y-auto p-4 sm:p-6 md:p-8 text-center"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Date & Title */}
        <div className="mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-cinzel font-semibold mb-2">
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          <h3 className="font-cinzel text-xl sm:text-3xl font-black text-slate-100 gold-gradient-text tracking-wide">
            Carta do Dia • Oráculo Diário
          </h3>
          <p className="text-xs text-purple-200/80 mt-1 max-w-md">
            Sua frequência energética e arquétipo guia para reflexão, presença e foco nas próximas 24 horas.
          </p>
        </div>

        {/* Card Artwork & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2 text-left">
          
          {/* Card Presentation */}
          <div className="md:col-span-5 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotateY: 5 }}
              onClick={() => onOpenCardDetail && onOpenCardDetail(dailyCard, null)}
              className="w-44 sm:w-52 aspect-[2/3] transform-gpu cursor-pointer shadow-2xl"
              title="Clique para ver detalhes completos"
            >
              <CardArt card={dailyCard} isMini={false} showKeywords={false} />
            </motion.div>
          </div>

          {/* Meaning & Daily Alignment */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-cinzel tracking-widest uppercase text-amber-400 font-bold">
                {dailyCard.arcana === 'Major' ? `Arcano Maior ${dailyCard.roman}` : suitConfig.name}
              </span>
              <h4 className="font-cinzel text-2xl font-bold text-slate-100 mt-0.5">
                {dailyCard.name}
              </h4>
              <p className="text-xs font-cinzel text-amber-300/80">
                {dailyCard.nameEn} • {dailyCard.archetype}
              </p>
            </div>

            {/* Daily Energy Message */}
            <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/30">
              <span className="font-cinzel text-[11px] font-bold text-purple-300 block mb-1">
                Foco e Energia do Dia:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {dailyCard.light}
              </p>
            </div>

            {/* Daily Advice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="font-cinzel text-[11px] font-bold text-amber-300 block mb-1">
                Conselho Prático para Hoje:
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{dailyCard.advice}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer Affirmation */}
        <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 italic">
            "Que a luz deste arcano inspire clareza em suas decisões hoje."
          </span>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95 text-center"
          >
            Acolher Mensagem
          </button>
        </div>
      </motion.div>
    </div>
  );
};
