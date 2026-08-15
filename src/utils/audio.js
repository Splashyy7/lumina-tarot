// Web Audio API Synthesizer for Mystical Tarot Soundscapes & Charming Sensory Feedback
class MysticAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    this.loadingNodes = null;
    this.lastCardHoverTime = 0;
    this.audioBuffers = {};
    this.setupAutoUnlock();
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pre-decode real natural audio samples into memory
  async preloadElementalAudio() {
    if (typeof window === 'undefined') return;
    this.init();
    if (!this.ctx) return;

    const files = {
      water: '/audio/water.wav',
      fire: '/audio/fire.wav',
      wind: '/audio/wind.wav',
      earth: '/audio/earth.wav',
      spirit: '/audio/spirit.wav',
    };

    for (const [key, path] of Object.entries(files)) {
      if (this.audioBuffers[key]) continue;
      try {
        const res = await fetch(path);
        if (!res.ok) continue;
        const arrayBuf = await res.arrayBuffer();
        this.audioBuffers[key] = await this.ctx.decodeAudioData(arrayBuf);
      } catch (e) {}
    }
  }

  // Play real audio sample from memory buffer
  playBuffer(name, volume = 0.5, maxDuration = 2.5) {
    if (this.muted) return false;
    this.init();
    if (!this.ctx) return false;

    const buffer = this.audioBuffers[name];
    if (!buffer) {
      this.preloadElementalAudio();
      return false;
    }

    try {
      const now = this.ctx.currentTime;
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();

      source.buffer = buffer;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.setValueAtTime(volume, now + maxDuration - 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + maxDuration);

      source.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
      source.stop(now + maxDuration);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Automatic Audio Context Unlocker on first user interaction
  setupAutoUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.init();
      this.preloadElementalAudio();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (this.loadingNodes && this.loadingNodes.gainNode) {
            const now = this.ctx.currentTime;
            this.loadingNodes.gainNode.gain.setValueAtTime(0.04, now);
          }
        }).catch(() => {});
      }
    };

    ['pointerdown', 'touchstart', 'click', 'keydown', 'mousemove'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: false, passive: true });
    });
  }

  setMuted(mute) {
    this.muted = mute;
    if (mute) {
      this.stopLoadingAmbience();
    }
  }

  isMuted() {
    return this.muted;
  }

  // Ambient Soft Loading Tone Engine
  startLoadingAmbience() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopLoadingAmbience();
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(396, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(594, now);
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(792, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.042, now + 0.35);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      this.loadingNodes = { osc1, osc2, osc3, gainNode, filter };
    } catch (e) {
      // Fallback
    }
  }

  updateLoadingProgress(progress) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const normalized = progress / 100;
      
      if (this.loadingNodes) {
        const newFreq1 = 396 + (normalized * 80);
        const newFreq2 = 594 + (normalized * 120);
        const newFreq3 = 792 + (normalized * 160);
        
        this.loadingNodes.osc1.frequency.setTargetAtTime(newFreq1, now, 0.1);
        this.loadingNodes.osc2.frequency.setTargetAtTime(newFreq2, now, 0.1);
        this.loadingNodes.osc3.frequency.setTargetAtTime(newFreq3, now, 0.1);
        this.loadingNodes.filter.frequency.setTargetAtTime(1100 + (normalized * 400), now, 0.1);
      }

      if ([15, 35, 55, 75, 95].includes(progress)) {
        const chimeNotes = { 15: 528, 35: 660, 55: 792, 75: 990, 95: 1188 };
        const freq = chimeNotes[progress] || 880;

        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'sine';
        tickOsc.frequency.setValueAtTime(freq, now);
        tickGain.gain.setValueAtTime(0.035, now);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        tickOsc.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tickOsc.start(now);
        tickOsc.stop(now + 0.28);
      }
    } catch (e) {
      // Fallback
    }
  }

  stopLoadingAmbience() {
    if (!this.loadingNodes || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.loadingNodes.gainNode.gain.cancelScheduledValues(now);
      this.loadingNodes.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      
      const currentNodes = this.loadingNodes;
      this.loadingNodes = null;
      
      setTimeout(() => {
        try {
          currentNodes.osc1.stop();
          currentNodes.osc2.stop();
          currentNodes.osc3.stop();
        } catch (err) {}
      }, 400);
    } catch (e) {
      this.loadingNodes = null;
    }
  }

  // Ultra-Charming Micro-Chime when hovering over cards (Throttled for sweet acoustic smoothness)
  playCardHover() {
    if (this.muted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastCardHoverTime < 50) return; // Prevent audio congestion
    this.lastCardHoverTime = nowMs;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Ethereal Pentatonic high crystal scale
      const pentatonic = [1174.66, 1318.51, 1567.98, 1760.0, 2093.0, 2349.32];
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Gentle ethereal chime on general UI hover
  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const notes = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.022, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  // Tactile sound of card landing on velvet altar table with soft wooden resonance
  playCardDeal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Soft card paper snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      // 2. Altar sacred bell harmonic
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(659.25, now + 0.02);
      bellGain.gain.setValueAtTime(0.025, now + 0.02);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      bell.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bell.start(now + 0.02);
      bell.stop(now + 0.4);
    } catch (e) {}
  }

  // Deep resonant chime + whoosh when selecting a card
  playSelect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, now);
      osc1.frequency.exponentialRampToValueAtTime(216, now + 0.6);
      gain1.gain.setValueAtTime(0.05, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(864, now);
      gain2.gain.setValueAtTime(0.025, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.6);
    } catch (e) {}
  }

  // Spread Mode Change Glissando (Harmonic Harp Sweep)
  playSpreadSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440.0, 554.37, 659.25, 880.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.02, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch (e) {}
  }

  // Theme change astral resonance
  playThemeChange() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528Hz Solfeggio Transformation
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // Light crystal tap when switching tabs/filter categories
  playTabSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Card Flip / Reveal Shimmer
  playFlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // Grand Celestial Chord when all cards are revealed or interpretation opens
  playGrandReveal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [185.0, 277.18, 369.99, 466.16, 622.25, 932.33];
      
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        
        gain.gain.setValueAtTime(0.035 / chord.length * (idx + 1), now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 2.5);
      });
    } catch (e) {}
  }

  // Realistic Multi-Stage Deck Shuffle Sound
  playShuffle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      for (let i = 0; i < 24; i++) {
        const clickTime = now + 0.2 + (i * 0.045) + (Math.random() * 0.01);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(250 + Math.random() * 600, clickTime);
        osc.frequency.exponentialRampToValueAtTime(100 + Math.random() * 200, clickTime + 0.04);

        gain.gain.setValueAtTime(0.035, clickTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(clickTime);
        osc.stop(clickTime + 0.045);
      }

      const endBellTime = now + 1.4;
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(1046.5, endBellTime);
      bellGain.gain.setValueAtTime(0.04, endBellTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, endBellTime + 0.8);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(endBellTime);
      bellOsc.stop(endBellTime + 0.8);
    } catch (e) {}
  }

  // Authentic Parchment Paper Rustle & Transcription Sound
  playPaperRustle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 0.42;
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.2;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2400, now);
      bandpass.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      bandpass.Q.setValueAtTime(2.0, now);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(750, now);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.035);
      gainNode.gain.exponentialRampToValueAtTime(0.03, now + 0.12);
      gainNode.gain.linearRampToValueAtTime(0.14, now + 0.18);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      noiseSource.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.42);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.28);
      oscGain.gain.setValueAtTime(0.015, now + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.04);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Dedicated Sound for Removing a Single Card (Button 'X' on Slots)
  playRemoveCard() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(450, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.16);
      gain1.gain.setValueAtTime(0.035, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(580, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(290, now + 0.14);
      gain2.gain.setValueAtTime(0.02, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.16);
    } catch (e) {}
  }

  // Dedicated Sound for Clearing the Entire Altar Table ("Limpar Mesa")
  playClearTable() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Altar Sweep Velvet Whoosh (Filtered soft noise)
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);
      filter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.4);

      // 2. Cascade of 3 returning card whisks (Descending triad: A5, E5, C5)
      const notes = [880, 659.25, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + 0.05 + idx * 0.07;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.18);
        
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch (e) {}
  }

  // Dedicated Soft Dismissal Pop for Closing Modals
  playCloseModal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
      
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Dedicated Sound for Zooming In / Inspecting a Tarot Card
  playInspectZoom() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Ascending Mystical Lens Sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.28);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      // Crystal Focus Harmonic
      const crystalOsc = this.ctx.createOscillator();
      const crystalGain = this.ctx.createGain();
      crystalOsc.type = 'triangle';
      crystalOsc.frequency.setValueAtTime(640, now + 0.04);
      crystalOsc.frequency.exponentialRampToValueAtTime(1480, now + 0.25);
      crystalGain.gain.setValueAtTime(0.02, now + 0.04);
      crystalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      crystalOsc.connect(crystalGain);
      crystalGain.connect(this.ctx.destination);
      crystalOsc.start(now + 0.04);
      crystalOsc.stop(now + 0.32);
    } catch (e) {}
  }

  // Grand Mystical Sanctuary Entry Sound
  playTempleEntry() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.stopLoadingAmbience();
      const now = this.ctx.currentTime;
      
      const notes = [293.66, 369.99, 440.0, 587.33, 739.99, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        
        gain.gain.setValueAtTime(0.04 / notes.length * (idx + 1.2), now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + 2.2);
      });

      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(200, now);
      lowpass.frequency.exponentialRampToValueAtTime(2000, now + 0.35);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      noise.connect(lowpass);
      lowpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.6);
    } catch (e) {}
  }

  // ==================== GENSHIN-INSPIRED WISH & SHOOTING STAR SOUNDS ====================
  
  playWishLaunch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 1.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 1.2);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.4);

      const shimmerNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      shimmerNotes.forEach((freq, i) => {
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(freq, now + i * 0.1);
        sGain.gain.setValueAtTime(0.015, now + i * 0.1);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        sOsc.connect(sGain);
        sGain.connect(this.ctx.destination);
        sOsc.start(now + i * 0.1);
        sOsc.stop(now + 1.2);
      });
    } catch (e) {}
  }

  playStarImpact() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.5);

      const chord = [293.66, 440.0, 587.33, 739.99, 880.0, 1174.66, 1760.0];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.04 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.4);
      });
    } catch (e) {}
  }

  playCardSummonCascade(count = 3) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < count; i++) {
        const time = now + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25 + i * 80, time);
        osc.frequency.exponentialRampToValueAtTime(1046.50 + i * 120, time + 0.15);

        gain.gain.setValueAtTime(0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.35);
      }
    } catch (e) {}
  }

  // Dedicated Sound for Concluding a Reading (Warm Celestial Resolution Harmonic)
  playConcludeReading() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Celestial resolution chord (F Major 9th harmonic)
      const chord = [349.23, 440.0, 523.25, 659.25, 880.0, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);

        gain.gain.setValueAtTime(0.04 / (idx + 1), now + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.025);
        osc.stop(now + 2.0);
      });
    } catch (e) {}
  }

  // ==================== ELEMENTAL ACOUSTIC SYNTHESIS ====================

  // 1. 💧 Água (Real Water Droplets Recording + Liquid Resonance)
  playElementWater() {
    if (this.muted) return;
    if (this.playBuffer('water', 0.08, 1.8)) return;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(1950, now);
      dropOsc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
      dropGain.gain.setValueAtTime(0.012, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      dropOsc.connect(dropGain);
      dropGain.connect(this.ctx.destination);
      dropOsc.start(now);
      dropOsc.stop(now + 0.16);
    } catch (e) {}
  }

  // 2. 🔥 Fogo (Real Crackling Campfire & Flame Whoosh)
  playElementFire() {
    if (this.muted) return;
    if (this.playBuffer('fire', 0.07, 2.0)) return;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const flameOsc = this.ctx.createOscillator();
      const flameGain = this.ctx.createGain();
      flameOsc.type = 'triangle';
      flameOsc.frequency.setValueAtTime(180, now);
      flameOsc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
      flameOsc.frequency.exponentialRampToValueAtTime(120, now + 0.4);
      flameGain.gain.setValueAtTime(0.001, now);
      flameGain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      flameGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      flameOsc.connect(flameGain);
      flameGain.connect(this.ctx.destination);
      flameOsc.start(now);
      flameOsc.stop(now + 0.45);
    } catch (e) {}
  }

  // 3. 🌪️ Ar (Real Howling Wind Breeze Recording)
  playElementAir() {
    if (this.muted) return;
    if (this.playBuffer('wind', 0.06, 1.8)) return;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const whistle = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(1174.66, now);
      whistle.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25);
      whistle.frequency.exponentialRampToValueAtTime(1046.50, now + 0.48);
      whistleGain.gain.setValueAtTime(0.008, now);
      whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      whistle.connect(whistleGain);
      whistleGain.connect(this.ctx.destination);
      whistle.start(now);
      whistle.stop(now + 0.5);
    } catch (e) {}
  }

  // 4. 🌿 Terra / Grama (Real Terrain / Grass Rustle Recording)
  playElementEarth() {
    if (this.muted) return;
    if (this.playBuffer('earth', 0.07, 1.8)) return;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const earthOsc = this.ctx.createOscillator();
      const earthGain = this.ctx.createGain();
      earthOsc.type = 'triangle';
      earthOsc.frequency.setValueAtTime(196.0, now);
      earthOsc.frequency.exponentialRampToValueAtTime(98.0, now + 0.3);
      earthGain.gain.setValueAtTime(0.008, now);
      earthGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      earthOsc.connect(earthGain);
      earthGain.connect(this.ctx.destination);
      earthOsc.start(now);
      earthOsc.stop(now + 0.38);
    } catch (e) {}
  }

  // 5. ✨ Éter / Destino / Espírito (Real Sacred Bells Recording & Singing Bowls)
  playElementSpirit() {
    if (this.muted) return;
    if (this.playBuffer('spirit', 0.07, 2.2)) return;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [432.0, 648.0, 864.0, 1296.0];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);
        gain.gain.setValueAtTime(0.008 / (idx + 1), now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + 1.6);
      });
    } catch (e) {}
  }

  // Master Intelligent Elemental Sound Dispatcher
  playCardElementalSound(card) {
    if (!card) return;

    const suit = (card.suit || '').toLowerCase();
    const elem = (card.element || '').toLowerCase();

    // 1. Water Detection (Cups / Copas / Água)
    if (suit === 'cups' || elem.includes('água') || elem.includes('agua') || elem.includes('water')) {
      this.playElementWater();
      return;
    }

    // 2. Fire Detection (Wands / Paus / Fogo)
    if (suit === 'wands' || elem.includes('fogo') || elem.includes('fire')) {
      this.playElementFire();
      return;
    }

    // 3. Air Detection (Swords / Espadas / Ar)
    if (suit === 'swords' || elem.includes('ar') || elem.includes('air') || elem.includes('vento')) {
      this.playElementAir();
      return;
    }

    // 4. Earth Detection (Pentacles / Ouros / Terra / Grama)
    if (suit === 'pentacles' || elem.includes('terra') || elem.includes('earth') || elem.includes('grama')) {
      this.playElementEarth();
      return;
    }

    // 5. Spirit / Major Arcana / Éter
    this.playElementSpirit();
  }
}

export const audio = new MysticAudioEngine();
