import React, { useState } from 'react';
import { 
  Sparkles, Volume2, VolumeX, HelpCircle, 
  Moon, Sun, Compass, Heart, Feather 
} from 'lucide-react';
import { audio } from '../utils/audio';

export const Header = ({ 
  userQuestion, 
  setUserQuestion, 
  onOpenGuide 
}) => {
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const [isFocused, setIsFocused] = useState(false);

  const toggleSound = () => {
    const nextMute = !isMuted;
    audio.setMuted(nextMute);
    setIsMuted(nextMute);
    if (!nextMute) {
      audio.playHover();
    }
  };

  return (
    <header className="relative w-full max-w-7xl mx-auto pt-6 pb-4 px-4 flex flex-col items-center text-center">
      {/* Top Bar with Brand & Utilities */}
      <div className="w-full flex items-center justify-between mb-4">
        {/* Subtle Symbol */}
        <div className="flex items-center gap-2 text-amber-400/80">
          <Moon className="w-4 h-4" />
          <span className="text-[11px] font-cinzel tracking-widest text-amber-200/70 uppercase">
            Oráculo Sagrado
          </span>
          <Sun className="w-4 h-4" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Efeitos Sonoros'}
            className="p-2 rounded-full glass-panel-subtle text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            title="Como funciona a leitura de Tarot"
            className="p-2 rounded-full glass-panel-subtle text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Mystical Emblem */}
      <div className="relative mb-2">
        {/* Glow behind title */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-amber-400/20 to-indigo-600/30 blur-2xl rounded-full pointer-events-none" />
        
        <div className="relative flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
          <h1 className="font-cinzel-dec text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider gold-gradient-text">
            LUMINA TAROT
          </h1>
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Subtitle */}
      <p className="font-cinzel text-xs sm:text-sm md:text-base text-purple-200/90 tracking-widest uppercase mb-6 max-w-xl">
        Sua Jornada Cósmica Começa • Escolha das 78 Cartas Arcanas
      </p>

      {/* Mentalize Question Input Box */}
      <div className="w-full max-w-2xl relative mb-4">
        <div className={`relative rounded-2xl transition-all duration-300 ${
          isFocused 
            ? 'shadow-[0_0_25px_rgba(251,191,36,0.3)] border border-amber-400/80 bg-slate-950/90' 
            : 'border border-purple-500/30 bg-slate-950/60 hover:border-purple-400/50'
        }`}>
          <div className="flex items-center px-4 py-2.5">
            <Feather className="w-4 h-4 text-amber-400/80 mr-3 shrink-0" />
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Mentalize sua intenção ou digite sua pergunta (opcional)..."
              className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            {userQuestion && (
              <button
                type="button"
                onClick={() => {
                  audio.playCloseModal();
                  setUserQuestion('');
                }}
                className="text-xs text-slate-500 hover:text-amber-300 ml-2 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
