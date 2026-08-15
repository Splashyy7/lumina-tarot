// Oracle Reading History & Journal Service (LocalStorage)
const STORAGE_KEY = 'lumina_tarot_history_v1';

const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lumina_history_updated'));
  }
};

export const historyService = {
  // Get all saved readings
  getReadings() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load tarot history', e);
      return [];
    }
  },

  // Save a new reading
  saveReading(reading) {
    if (typeof window === 'undefined') return null;
    try {
      const current = this.getReadings();
      const newEntry = {
        id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        spreadId: reading.spreadConfig.id,
        spreadName: reading.spreadConfig.name,
        spreadShortName: reading.spreadConfig.shortName,
        userQuestion: reading.userQuestion || '',
        cards: reading.chosenCards.map((card, idx) => ({
          ...card,
          positionName: reading.spreadConfig.positions[idx]?.name || `Slot ${idx + 1}`,
          positionSubtitle: reading.spreadConfig.positions[idx]?.subtitle || ''
        })),
        aiReading: reading.aiReading || null,
        oracleSynthesis: reading.aiReading?.text || reading.oracleSynthesis || '',
        notes: reading.notes || ''
      };

      const updated = [newEntry, ...current].slice(0, 50); // Keep last 50 readings
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifyUpdate();
      return newEntry;
    } catch (e) {
      console.error('Failed to save reading', e);
      return null;
    }
  },

  // Delete a reading by ID
  deleteReading(id) {
    try {
      const current = this.getReadings();
      const filtered = current.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      notifyUpdate();
      return filtered;
    } catch (e) {
      console.error('Failed to delete reading', e);
      return [];
    }
  },

  // Update user notes on an existing reading
  updateReadingNotes(id, notes) {
    try {
      const current = this.getReadings();
      const updated = current.map(r => r.id === id ? { ...r, notes } : r);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifyUpdate();
      return updated;
    } catch (e) {
      console.error('Failed to update reading notes', e);
      return [];
    }
  },

  // Clear all history
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      notifyUpdate();
      return [];
    } catch (e) {
      return [];
    }
  }
};
