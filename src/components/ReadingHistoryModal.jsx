import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, BookOpen, Trash2, Calendar, 
  Search, Eye, Edit3, Check, RotateCcw, Feather 
} from 'lucide-react';
import { CardArt } from './CardArt';
import { historyService } from '../utils/history';
import { audio } from '../utils/audio';

export const ReadingHistoryModal = ({ 
  isOpen, 
  onClose,
  onOpenCardDetail 
}) => {
  const [readings, setReadings] = useState(() => historyService.getReadings());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedReading, setSelectedReading] = useState(null);

  // Synchronize readings dynamically on open and whenever a new reading is saved
  useEffect(() => {
    const refresh = () => setReadings(historyService.getReadings());
    if (isOpen) {
      refresh();
    }
    window.addEventListener('lumina_history_updated', refresh);
    return () => window.removeEventListener('lumina_history_updated', refresh);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    audio.playCloseModal();
    onClose();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    audio.playRemoveCard();
    const updated = historyService.deleteReading(id);
    setReadings(updated);
    if (selectedReading?.id === id) {
      setSelectedReading(null);
    }
  };

  const handleStartEdit = (reading, e) => {
    e.stopPropagation();
    setEditingId(reading.id);
    setEditingText(reading.notes || '');
  };

  const handleSaveNotes = (id, e) => {
    e.stopPropagation();
    audio.playSelect();
    const updated = historyService.updateReadingNotes(id, editingText);
    setReadings(updated);
    setEditingId(null);
  };

  const filteredReadings = readings.filter(r => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchQuestion = r.userQuestion?.toLowerCase().includes(query);
    const matchSpread = r.spreadName?.toLowerCase().includes(query);
    const matchCards = r.cards?.some(c => c.name?.toLowerCase().includes(query));
    const matchNotes = r.notes?.toLowerCase().includes(query);
    return matchQuestion || matchSpread || matchCards || matchNotes;
  });

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
        className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-amber-500/40 shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-slate-100 gold-gradient-text">
              Diário Oracular & Histórico de Leituras
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="my-4 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por carta, pergunta, tiragem ou notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/70 border border-purple-500/30 focus:border-amber-400/70 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>

          <span className="text-xs font-cinzel text-amber-300/80 shrink-0">
            {readings.length} {readings.length === 1 ? 'leitura' : 'leituras'}
          </span>
        </div>

        {/* Main List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {readings.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-cinzel">
              <Sparkles className="w-8 h-8 text-amber-400/40 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-semibold">Seu Diário Oracular está vazio.</p>
              <p className="text-xs text-slate-500 mt-1">
                Ao concluir uma tiragem no altar, ela será gravada aqui para você revisitar suas reflexões.
              </p>
            </div>
          ) : filteredReadings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-cinzel text-xs">
              Nenhuma leitura encontrada para a busca informada.
            </div>
          ) : (
            filteredReadings.map((reading) => {
              const isSelected = selectedReading?.id === reading.id;
              const isEditing = editingId === reading.id;

              return (
                <motion.div
                  key={reading.id}
                  layout
                  className={`rounded-2xl border transition-all p-4 ${
                    isSelected 
                      ? 'bg-purple-950/50 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                      : 'bg-slate-950/60 border-amber-500/20 hover:border-purple-500/40'
                  }`}
                >
                  {/* Top Row: Spread name, Date & Delete */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-amber-300 font-cinzel text-xs font-bold">
                        {reading.spreadShortName || reading.spreadName}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        {reading.formattedDate}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(reading.id, e)}
                      title="Excluir leitura do diário"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question */}
                  {reading.userQuestion && (
                    <p className="text-xs text-amber-200/90 italic mb-3 font-cinzel">
                      "{reading.userQuestion}"
                    </p>
                  )}

                  {/* Cards Row Preview */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                    {reading.cards.map((card, idx) => (
                      <div 
                        key={idx}
                        onClick={() => onOpenCardDetail && onOpenCardDetail(card, { name: card.positionName, subtitle: card.positionSubtitle })}
                        className="flex-shrink-0 w-20 sm:w-24 aspect-[2/3] cursor-pointer transform hover:scale-105 transition-transform"
                        title={`${card.positionName}: ${card.name}`}
                      >
                        <CardArt card={card} isMini={true} showKeywords={false} />
                      </div>
                    ))}
                  </div>

                  {/* Notes Section */}
                  <div className="mt-3 pt-3 border-t border-purple-900/30 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-cinzel font-semibold text-slate-400 flex items-center gap-1">
                        <Feather className="w-3 h-3 text-amber-400" />
                        Anotações Pessoais:
                      </span>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(reading, e)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{reading.notes ? 'Editar' : 'Adicionar Nota'}</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          placeholder="Digite suas percepções, sentimentos ou insights sobre esta tiragem..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/50 text-xs text-slate-100 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={(e) => handleSaveNotes(reading.id, e)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvar</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic">
                        {reading.notes || <span className="text-slate-600 not-italic">Nenhuma anotação inserida.</span>}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
