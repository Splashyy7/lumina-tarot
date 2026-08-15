import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, HelpCircle, Sparkles, CheckCircle2, 
  XCircle, AlertCircle, RotateCcw, Feather, Dices 
} from 'lucide-react';
import { CardArt } from './CardArt';
import { TAROT_DECK } from '../data/tarotDeck';
import { getYesNoEvaluation } from '../utils/yesNoOracle';
import { audio } from '../utils/audio';

export const YesNoOracleModal = ({ 
  isOpen, 
  onClose,
  allowReversed = false 
}) => {
  const [question, setQuestion] = useState('');
  const [drawnCard, setDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    audio.playCloseModal();
    onClose();
  };

  const handleDraw = () => {
    if (isDrawing) return;
    audio.playShuffle();
    setIsDrawing(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
      const isCardReversed = allowReversed ? Math.random() < 0.35 : false;
      const card = {
        ...TAROT_DECK[randomIndex],
        isReversed: isCardReversed
      };
      
      setDrawnCard(card);
      setIsDrawing(false);
      audio.playGrandReveal();
    }, 600);
  };

  const handleReset = () => {
    audio.playSelect();
    setDrawnCard(null);
  };

  const evaluation = drawnCard ? getYesNoEvaluation(drawnCard, drawnCard.isReversed) : null;

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
        className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090D24] border border-amber-500/40 shadow-2xl overflow-y-auto p-4 sm:p-6 md:p-8 text-center"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-amber-300 text-xs font-cinzel font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Oráculo de Resposta Direta</span>
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-black text-slate-100 gold-gradient-text tracking-wide">
            Oráculo do Sim ou Não
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Mentalize uma pergunta direta para receber a resposta energética e o conselho das cartas.
          </p>
        </div>

        {/* Question Input Box */}
        {!drawnCard && (
          <div className="my-4">
            <div className="relative rounded-2xl border border-amber-500/30 bg-slate-950/70 p-3 text-left">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ex: Devo aceitar esta oportunidade? / Vou conseguir?"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleDraw}
              disabled={isDrawing}
              className={`mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-cinzel font-black text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2
                ${isDrawing ? 'animate-pulse opacity-80' : ''}
              `}
            >
              <Dices className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
              <span>{isDrawing ? 'Consultando as Energias...' : 'Tirar Carta & Revelar Resposta'}</span>
            </button>
          </div>
        )}

        {/* Revealed Result Display */}
        {drawnCard && evaluation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 my-2"
          >
            {/* Question Echo */}
            {question && (
              <p className="text-xs text-amber-200 italic font-cinzel">
                "{question}"
              </p>
            )}

            {/* Verdict Badge */}
            <div className={`px-6 py-2.5 rounded-2xl border text-base sm:text-lg font-cinzel font-black tracking-widest shadow-xl animate-pulse ${evaluation.badgeBg} ${evaluation.color}`}>
              {evaluation.verdict}
            </div>

            {/* Card Preview & Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center w-full text-left my-2">
              <div className="sm:col-span-5 flex justify-center">
                <div className="w-36 sm:w-40 aspect-[2/3] shadow-2xl rounded-xl">
                  <CardArt card={drawnCard} isMini={false} showKeywords={false} />
                </div>
              </div>

              <div className="sm:col-span-7 flex flex-col gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-cinzel text-amber-400 font-bold uppercase">
                    Arcano Revelado:
                  </span>
                  <h4 className="font-cinzel text-lg font-bold text-slate-100">
                    {drawnCard.name} {drawnCard.isReversed && <span className="text-red-400 text-xs">(Invertida)</span>}
                  </h4>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="font-semibold text-slate-300 block mb-1">
                    Significado para sua Dúvida:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {evaluation.summary}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30">
                  <span className="font-cinzel font-bold text-amber-300 block mb-1">
                    Conselho do Oráculo:
                  </span>
                  <p className="text-slate-200 italic leading-relaxed">
                    "{drawnCard.advice}"
                  </p>
                </div>
              </div>
            </div>

            {/* Reset / New Question Button */}
            <div className="flex items-center gap-3 w-full mt-3 pt-3 border-t border-purple-900/30">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Outra Pergunta</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel font-bold text-xs cursor-pointer transition-all shadow-md"
              >
                Concluir
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
