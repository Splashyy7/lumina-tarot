// Bulletproof Sanctuary Ambient Music Manager (Dual-Engine: HTML5 Audio + Web Audio Fallback for GitHub Pages)

class BackgroundMusicService {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isLoading = false;
    this.volume = 0.15; // Set gentle (15% volume default)
    this.isInitialized = false;
    this.webAudioCtx = null;
    this.webAudioSource = null;
    this.webAudioGain = null;
    this.audioBuffer = null;
    this.setupAutoUnlock();
  }

  // Pre-unlock audio permission on first interaction
  setupAutoUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.init();
      ['pointerdown', 'touchstart', 'click'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };
    ['pointerdown', 'touchstart', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  getResolvedUrl() {
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}audio/sanctuary.mp3`;
  }

  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    const audioSrc = this.getResolvedUrl();
    try {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.src = audioSrc;
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';
      this.isInitialized = true;
    } catch (e) {
      console.warn('HTML5 Audio init fallback to Web Audio', e);
    }
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lumina_bg_music_changed', {
        detail: { isPlaying: this.isPlaying, volume: this.volume, isLoading: this.isLoading }
      }));
    }
  }

  async playWithWebAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.webAudioCtx && AudioCtx) {
        this.webAudioCtx = new AudioCtx();
      }
      if (this.webAudioCtx && this.webAudioCtx.state === 'suspended') {
        await this.webAudioCtx.resume();
      }

      if (!this.audioBuffer) {
        const audioSrc = this.getResolvedUrl();
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.webAudioCtx.decodeAudioData(arrayBuffer);
      }

      if (this.webAudioSource) {
        try { this.webAudioSource.stop(); } catch (e) {}
      }

      this.webAudioSource = this.webAudioCtx.createBufferSource();
      this.webAudioSource.buffer = this.audioBuffer;
      this.webAudioSource.loop = true;

      this.webAudioGain = this.webAudioCtx.createGain();
      this.webAudioGain.gain.setValueAtTime(this.volume, this.webAudioCtx.currentTime);

      this.webAudioSource.connect(this.webAudioGain);
      this.webAudioGain.connect(this.webAudioCtx.destination);

      this.webAudioSource.start(0);
      this.isPlaying = true;
      this.isLoading = false;
      this.notify();
      return true;
    } catch (err) {
      console.error('Web Audio fallback failed:', err);
      this.isPlaying = false;
      this.isLoading = false;
      this.notify();
      return false;
    }
  }

  async play() {
    this.init();
    this.isLoading = true;
    this.isPlaying = true; // Show active state immediately to avoid UI flickering
    this.notify();

    // Strategy 1: HTML5 Audio
    if (this.audio) {
      try {
        this.audio.volume = this.volume;
        await this.audio.play();
        this.isPlaying = true;
        this.isLoading = false;
        this.notify();
        return;
      } catch (err) {
        console.warn('HTML5 Audio play failed, falling back to Web Audio API buffer:', err);
      }
    }

    // Strategy 2: Web Audio API (Guaranteed on GitHub Pages without HTTP 206 Range requirements)
    await this.playWithWebAudio();
  }

  pause() {
    this.isLoading = false;
    this.isPlaying = false;

    // Pause HTML5 Audio
    if (this.audio) {
      try { this.audio.pause(); } catch (e) {}
    }

    // Pause Web Audio API
    if (this.webAudioSource) {
      try {
        this.webAudioSource.stop();
        this.webAudioSource.disconnect();
        this.webAudioSource = null;
      } catch (e) {}
    }

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
    if (this.webAudioGain && this.webAudioCtx) {
      this.webAudioGain.gain.setValueAtTime(this.volume, this.webAudioCtx.currentTime);
    }
    this.notify();
  }

  getVolume() {
    return this.volume;
  }
}

export const bgMusicService = new BackgroundMusicService();
