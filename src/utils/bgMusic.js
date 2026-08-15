// Background Sanctuary Ambient Music Manager (HTML5 Audio for genuine soundtrack)

class BackgroundMusicService {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.volume = 0.15; // Set low and gentle by default (15% volume)
    this.isInitialized = false;
  }

  init() {
    if (typeof window === 'undefined' || this.audio) return;
    
    this.audio = new Audio('/audio/sanctuary.mp3');
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'metadata';
    this.isInitialized = true;
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lumina_bg_music_changed', {
        detail: { isPlaying: this.isPlaying, volume: this.volume }
      }));
    }
  }

  play() {
    this.init();
    if (!this.audio) return;

    this.audio.volume = this.volume;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(err => {
      console.warn('Auto-play blocked or audio load error:', err);
      this.isPlaying = false;
      this.notify();
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.notify();
  }

  getVolume() {
    return this.volume;
  }
}

export const bgMusicService = new BackgroundMusicService();
