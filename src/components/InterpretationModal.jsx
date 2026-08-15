import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CardArt } from './CardArt';
import { 
  X, Sparkles, BookOpen, Share2, Copy, Bookmark,
  RotateCcw, Check, Flame, Droplets, Wind, Mountain, 
  Feather, Shield, Sun, Star 
} from 'lucide-react';
import { SUITS } from '../data/tarotDeck';
import { audio } from '../utils/audio';
import { historyService } from '../utils/history';

export const InterpretationModal = ({ 
  spreadConfig, 
  chosenCards, 
  userQuestion, 
  onClose, 
  onResetReading 
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Launch celestial gold & purple star confetti
    try {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.45 },
        colors: ['#FBBF24', '#C084FC', '#F59E0B', '#38BDF8', '#FFFFFF'],
      });
    } catch (e) {
      // Fallback
    }
  }, []);

  // Compute elemental and arcana balance
  const stats = {
    majorCount: 0,
    wandsCount: 0,
    cupsCount: 0,
    swordsCount: 0,
    pentaclesCount: 0,
  };

  chosenCards.forEach((c) => {
    if (!c) return;
    if (c.arcana === 'Major') stats.majorCount++;
    if (c.suit === 'wands') stats.wandsCount++;
    if (c.suit === 'cups') stats.cupsCount++;
    if (c.suit === 'swords') stats.swordsCount++;
    if (c.suit === 'pentacles') stats.pentaclesCount++;
  });

  // Synthesize holistic reading narrative
  const generateSynthesis = () => {
    const cardNames = chosenCards.filter(Boolean).map(c => c.name).join(', ');
    
    let tone = '';
    if (stats.majorCount >= 2) {
      tone = 'Esta leitura carrega um peso cármico e espiritual significativo. Forças profundas de destino e transformação existencial estão em pleno curso.';
    } else if (stats.wandsCount >= 2) {
      tone = 'A energia predominante é o Fogo (Paus): momento de iniciativa, paixão, coragem e criação audaciosa.';
    } else if (stats.cupsCount >= 2) {
      tone = 'A energia predominante é a Água (Copas): o coração, as emoções profundas e a intuição são as chaves mestras para esta questão.';
    } else if (stats.swordsCount >= 2) {
      tone = 'A energia predominante é o Ar (Espadas): clareza mental, verdade, corte de ilusões e discernimento lógico são imperativos.';
    } else if (stats.pentaclesCount >= 2) {
      tone = 'A energia predominante é a Terra (Ouros): concretização material, finanças, paciência e colheita prática definem o rumo.';
    } else {
      tone = 'Uma tiragem equilibrada entre diferentes elementos, indicando que todos os aspectos (mente, corpo, emoção e espírito) devem ser integrados.';
    }

    return {
      cardNames,
      tone,
      affirmation: `Eu acolho a sabedoria de ${chosenCards[0]?.name || 'minha jornada'}, integro a força de ${chosenCards[1]?.name || 'minhas ações'} e confio no destino revelado por ${chosenCards[chosenCards.length - 1]?.name || 'meu caminho'}. Que a luz guie meus passos.`
    };
  };

  const synthesis = generateSynthesis();

  // Copy full reading text to clipboard with authentic paper rustle sound
  const handleCopyReading = () => {
    audio.playPaperRustle();
    const lines = [
      `🔮 LUMINA TAROT - LEITURA ORACULAR`,
      `Tiragem: ${spreadConfig.name}`,
      userQuestion ? `Intenção / Pergunta: "${userQuestion}"` : '',
      `Data: ${new Date().toLocaleDateString('pt-BR')}`,
      `----------------------------------------`,
      ...chosenCards.map((c, i) => {
        const pos = spreadConfig.positions[i];
        return `[${i + 1}] ${pos ? pos.name : 'Posição ' + (i + 1)}: ${c.name} (${c.roman})\n• Luz: ${c.light}\n• Conselho: "${c.advice}"\n`;
      }),
      `----------------------------------------`,
      `🌌 SÍNTESE DO ORÁCULO:`,
      synthesis.tone,
      `\n✨ AFIRMAÇÃO DE PODER:`,
      synthesis.affirmation
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClose = () => {
    audio.playCloseModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Outer Click Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg"
        onClick={handleClose} 
      />

      {/* Main Modal Container with Spring Physics */}
      <motion.div 
        role="dialog" 
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-amber-400/50 shadow-2xl p-6 md:p-10 my-6"
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-6 border-b border-amber-500/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-cinzel font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Revelação do Oráculo Sagrado</span>
          </div>

          <h2 className="font-cinzel text-2xl md:text-4xl font-black text-slate-100 gold-gradient-text tracking-wide">
            Interpretação Completa da Tiragem
          </h2>

          <p className="font-cinzel text-xs md:text-sm text-purple-200/80 mt-1">
            {spreadConfig.name} • {chosenCards.length} Cartas Reveladas
          </p>

          {userQuestion && (
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-xl mx-auto p-3 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs md:text-sm text-amber-200 italic"
            >
              <span className="font-bold text-amber-400 not-italic block mb-0.5 font-cinzel">Sua Pergunta / Intenção:</span>
              "{userQuestion}"
            </motion.div>
          )}
        </div>

        {/* Card Cards Row in the Reading */}
        <div className="my-8">
          <h3 className="font-cinzel text-sm font-bold text-amber-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>As Cartas em suas Posições</span>
          </h3>

          <div className={`grid gap-4 sm:gap-6 ${
            chosenCards.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : chosenCards.length > 5
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {chosenCards.map((card, idx) => {
              const pos = spreadConfig.positions[idx];
              const suitConf = SUITS[card.suit.toUpperCase()] || SUITS.MAJOR;

              return (
                <motion.div 
                  key={card.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl glass-panel-subtle border border-amber-500/20 p-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors"
                >
                  {/* Position Header */}
                  <div className="mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-amber-300 font-cinzel text-[11px] font-bold">
                      <span className="truncate">{pos ? pos.name : `Carta ${idx + 1}`}</span>
                    </div>
                    {pos && (
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {pos.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Card Art Preview */}
                  <div className="w-36 sm:w-40 aspect-[2/3] mx-auto my-2">
                    <CardArt card={card} isMini={true} showKeywords={false} />
                  </div>

                  {/* Card Title & Position Meaning */}
                  <div className="mt-3 text-left">
                    <h4 className="font-cinzel text-base font-bold text-slate-100">
                      {card.name}
                    </h4>
                    <span className="text-[11px] text-amber-300/80 font-cinzel block mb-2">
                      {card.arcana === 'Major' ? `Arcano Maior ${card.roman}` : suitConf.name}
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {pos?.name.includes('Passado') && (card.past || card.light)}
                      {pos?.name.includes('Presente') && (card.present || card.light)}
                      {pos?.name.includes('Futuro') && (card.future || card.light)}
                      {!pos?.name.includes('Passado') && 
                       !pos?.name.includes('Presente') && 
                       !pos?.name.includes('Futuro') && (card.light)}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/20 text-[11px] text-purple-200 italic">
                      <span className="font-bold text-amber-300 not-italic block mb-0.5">Conselho:</span>
                      "{card.advice}"
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Elemental & Arcana Distribution Bar */}
        <div className="my-6 p-4 rounded-2xl glass-panel-subtle border border-purple-500/30">
          <h4 className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
            Balanço Elemental da Tiragem
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            {stats.majorCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-400/40 text-amber-300 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{stats.majorCount} Arcanos Maiores (Destino)</span>
              </div>
            )}
            {stats.wandsCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-950/60 border border-orange-400/40 text-orange-300 text-xs">
                <Flame className="w-3.5 h-3.5" />
                <span>{stats.wandsCount} Fogo / Paus (Ação & Paixão)</span>
              </div>
            )}
            {stats.cupsCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 border border-cyan-400/40 text-cyan-300 text-xs">
                <Droplets className="w-3.5 h-3.5" />
                <span>{stats.cupsCount} Água / Copas (Coração & Intuição)</span>
              </div>
            )}
            {stats.swordsCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-400/40 text-slate-200 text-xs">
                <Wind className="w-3.5 h-3.5" />
                <span>{stats.swordsCount} Ar / Espadas (Mente & Verdade)</span>
              </div>
            )}
            {stats.pentaclesCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs">
                <Mountain className="w-3.5 h-3.5" />
                <span>{stats.pentaclesCount} Terra / Ouros (Matéria & Prática)</span>
              </div>
            )}
          </div>
        </div>

        {/* Holistic Oracle Synthesis */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-950/80 to-purple-950/70 border border-amber-500/40 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-cinzel text-lg font-bold text-amber-200">
              Síntese & Mensagem Integrada do Oráculo
            </h3>
          </div>
          
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-4">
            {synthesis.tone}
          </p>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-400/30">
            <span className="font-cinzel text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
              Afirmação de Conexão:
            </span>
            <p className="text-xs md:text-sm text-amber-100/90 italic leading-relaxed">
              "{synthesis.affirmation}"
            </p>
          </div>
        </div>

        {/* Bottom Actions Bar - Full Mobile Width */}
        <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyReading}
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiada!' : 'Copiar Leitura'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playSelect();
                historyService.saveReading({ spreadConfig, chosenCards, userQuestion });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              className={`flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95
                ${saved 
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300' 
                  : 'glass-panel-subtle hover:border-amber-400/60 text-amber-300'
                }
              `}
            >
              {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-amber-400" />}
              <span>{saved ? 'Salvo no Diário!' : 'Salvar no Diário'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onResetReading) onResetReading();
              }}
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nova Tiragem</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex-1 sm:flex-initial px-5 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-cinzel font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 text-center"
            >
              Concluir
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
