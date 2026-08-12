import React, { useState, useEffect, useCallback } from 'react';
import { TAROT_DECK } from '../data/tarotDeck';
import { SPREAD_TYPES } from '../data/spreads';
import { Header } from './Header';
import { SpreadSelector } from './SpreadSelector';
import { SpreadArea } from './SpreadArea';
import { DeckSelectionGrid } from './DeckSelectionGrid';
import { CardDetailModal } from './CardDetailModal';
import { InterpretationModal } from './InterpretationModal';
import { GuideModal } from './GuideModal';
import { ConfirmSpreadChangeModal } from './ConfirmSpreadChangeModal';
import { BackgroundStars } from './BackgroundStars';
import { audio } from '../utils/audio';

// Fisher-Yates Deck Shuffle Utility
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const TarotTable = () => {
  // 1. Deck state (78 cards with estaEscolhida boolean)
  const [deck, setDeck] = useState(() => {
    const initialDeck = TAROT_DECK.map(card => ({
      ...card,
      estaEscolhida: false,
    }));
    return shuffleArray(initialDeck);
  });

  // 2. Active spread type (Default: 3 cards - Passado, Presente & Futuro)
  const [activeSpread, setActiveSpread] = useState(SPREAD_TYPES[0]);

  // 3. Chosen cards in spread slots (Array matching spread length)
  const [chosenCards, setChosenCards] = useState(() => 
    new Array(SPREAD_TYPES[0].positions.length).fill(null)
  );

  // 4. Question / Intent state
  const [userQuestion, setUserQuestion] = useState('');

  // 5. Modal states
  const [inspectingCardData, setInspectingCardData] = useState(null);
  const [isInterpretationOpen, setIsInterpretationOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [pendingSpreadChange, setPendingSpreadChange] = useState(null);

  // Remaining cards to pick for current spread
  const filledCount = chosenCards.filter(Boolean).length;
  const totalSlots = activeSpread.positions.length;
  const canSelectMore = filledCount < totalSlots;
  const remainingToPick = totalSlots - filledCount;

  // Shuffle Deck Handler
  const handleShuffleDeck = useCallback(() => {
    setDeck(prevDeck => {
      // Re-shuffle while maintaining unchosen state
      const refreshed = TAROT_DECK.map(card => {
        const alreadyChosen = chosenCards.some(c => c && c.id === card.id);
        return {
          ...card,
          estaEscolhida: alreadyChosen,
        };
      });
      return shuffleArray(refreshed);
    });
  }, [chosenCards]);

  // Reset entire spread and restore deck
  const handleResetSpread = useCallback(() => {
    setChosenCards(new Array(activeSpread.positions.length).fill(null));
    setDeck(prevDeck => prevDeck.map(card => ({ ...card, estaEscolhida: false })));
  }, [activeSpread]);

  // Spread Change Request Handler (Checks if table has cards to show custom overlay)
  const handleSelectSpreadRequest = useCallback((newSpread) => {
    if (newSpread.id === activeSpread.id) return;
    
    if (filledCount > 0) {
      setPendingSpreadChange(newSpread);
    } else {
      setActiveSpread(newSpread);
      setChosenCards(new Array(newSpread.positions.length).fill(null));
      setDeck(prevDeck => prevDeck.map(card => ({ ...card, estaEscolhida: false })));
    }
  }, [activeSpread, filledCount]);

  // Confirm Spread Change via Custom Modal
  const handleConfirmSpreadChange = useCallback(() => {
    if (!pendingSpreadChange) return;
    setActiveSpread(pendingSpreadChange);
    setChosenCards(new Array(pendingSpreadChange.positions.length).fill(null));
    setDeck(prevDeck => prevDeck.map(card => ({ ...card, estaEscolhida: false })));
    setPendingSpreadChange(null);
  }, [pendingSpreadChange]);

  // Card Selection Handler (Click from Grid)
  const handleSelectCard = useCallback((card) => {
    if (!canSelectMore || card.estaEscolhida) return;

    // 1. Find next available empty slot index
    const nextSlotIndex = chosenCards.findIndex(c => c === null);
    if (nextSlotIndex === -1) return;

    // 2. Mark card as chosen in deck
    setDeck(prevDeck => 
      prevDeck.map(c => c.id === card.id ? { ...c, estaEscolhida: true } : c)
    );

    // 3. Place card into chosen spread slot
    setChosenCards(prevChosen => {
      const updated = [...prevChosen];
      updated[nextSlotIndex] = { ...card, estaEscolhida: true };
      return updated;
    });
  }, [canSelectMore, chosenCards]);

  // Remove Card from Spread Slot Handler
  const handleRemoveCard = useCallback((slotIndex) => {
    const cardToRemove = chosenCards[slotIndex];
    if (!cardToRemove) return;

    // Unmark in deck
    setDeck(prevDeck => 
      prevDeck.map(c => c.id === cardToRemove.id ? { ...c, estaEscolhida: false } : c)
    );

    // Remove from spread
    setChosenCards(prevChosen => {
      const updated = [...prevChosen];
      updated[slotIndex] = null;
      return updated;
    });
  }, [chosenCards]);

  // Random Pick (Escolha Guiada pelo Destino)
  const handleRandomPick = useCallback(() => {
    if (!canSelectMore) return;

    const availableCards = deck.filter(c => !c.estaEscolhida);
    if (availableCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const chosenOne = availableCards[randomIndex];
    handleSelectCard(chosenOne);
  }, [canSelectMore, deck, handleSelectCard]);

  // Inspect Card Details (Play dedicated mystical zoom sound)
  const handleInspectCard = useCallback((card, positionInfo) => {
    audio.playInspectZoom();
    setInspectingCardData({ card, positionInfo });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070A18] text-slate-100 selection:bg-amber-400/30 selection:text-amber-200">
      {/* Background Animated Celestial Stars Canvas */}
      <BackgroundStars />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20">
        
        {/* Header with Title & Question Input */}
        <Header
          userQuestion={userQuestion}
          setUserQuestion={setUserQuestion}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Spread Selector Navigation */}
        <SpreadSelector
          currentSpread={activeSpread}
          onSelectSpread={handleSelectSpreadRequest}
        />

        {/* The Spread Reading Altar (Slots Area) */}
        <SpreadArea
          spreadConfig={activeSpread}
          chosenCards={chosenCards}
          onCardClick={handleInspectCard}
          onRemoveCard={handleRemoveCard}
          onOpenInterpretation={() => setIsInterpretationOpen(true)}
          onResetSpread={handleResetSpread}
        />

        {/* The 78-Card Deck Selection Grid */}
        <DeckSelectionGrid
          deck={deck}
          onSelectCard={handleSelectCard}
          onRandomPick={handleRandomPick}
          onShuffleDeck={handleShuffleDeck}
          canSelectMore={canSelectMore}
          remainingToPick={remainingToPick}
        />

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 border-t border-purple-900/30 glass-panel-subtle mt-auto">
        <p className="font-cinzel tracking-wider text-amber-200/60">
          Lumina Tarot • Sabedoria Ancestral & Arcanos do Destino
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Inspirado na arte e tradição do Tarot com 78 cartas clássicas.
        </p>
      </footer>

      {/* Single Card Inspector Modal */}
      {inspectingCardData && (
        <CardDetailModal
          card={inspectingCardData.card}
          positionInfo={inspectingCardData.positionInfo}
          onClose={() => setInspectingCardData(null)}
        />
      )}

      {/* Full Reading Interpretation Modal */}
      {isInterpretationOpen && (
        <InterpretationModal
          spreadConfig={activeSpread}
          chosenCards={chosenCards.filter(Boolean)}
          userQuestion={userQuestion}
          onClose={() => setIsInterpretationOpen(false)}
          onResetReading={handleResetSpread}
        />
      )}

      {/* Oracle Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Custom Mystical Confirm Spread Change Overlay Modal */}
      <ConfirmSpreadChangeModal
        isOpen={Boolean(pendingSpreadChange)}
        targetSpread={pendingSpreadChange}
        currentSpread={activeSpread}
        onConfirm={handleConfirmSpreadChange}
        onCancel={() => setPendingSpreadChange(null)}
      />
    </div>
  );
};
