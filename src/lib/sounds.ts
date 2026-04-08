'use client';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

function playSequence(notes: { freq: number; dur: number; delay: number }[], type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext();
  notes.forEach(({ freq, dur, delay }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + dur);
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + dur);
  });
}

export function playCorrectSound() {
  playSequence([
    { freq: 523.25, dur: 0.15, delay: 0 },
    { freq: 783.99, dur: 0.3, delay: 0.15 },
  ], 'sine', 0.25);
}

export function playWrongSound() {
  playSequence([
    { freq: 400, dur: 0.15, delay: 0 },
    { freq: 300, dur: 0.3, delay: 0.15 },
  ], 'sawtooth', 0.15);
}

export function playKingFoundSound() {
  playSequence([
    { freq: 523.25, dur: 0.15, delay: 0 },
    { freq: 659.25, dur: 0.15, delay: 0.15 },
    { freq: 783.99, dur: 0.15, delay: 0.3 },
    { freq: 1046.5, dur: 0.5, delay: 0.45 },
  ], 'sine', 0.3);
}

export function playCountdownTick() {
  playTone(800, 0.05, 'square', 0.1);
}

export function playVictoryFanfare() {
  playSequence([
    { freq: 523.25, dur: 0.2, delay: 0 },
    { freq: 659.25, dur: 0.2, delay: 0.2 },
    { freq: 783.99, dur: 0.2, delay: 0.4 },
    { freq: 1046.5, dur: 0.2, delay: 0.6 },
    { freq: 783.99, dur: 0.15, delay: 0.85 },
    { freq: 1046.5, dur: 0.6, delay: 1.0 },
  ], 'sine', 0.3);
}

export function playRPSBeat() {
  playTone(200, 0.1, 'triangle', 0.3);
}

export function playRPSReveal() {
  playSequence([
    { freq: 600, dur: 0.1, delay: 0 },
    { freq: 900, dur: 0.2, delay: 0.1 },
  ], 'square', 0.15);
}

export function playButtonClick() {
  playTone(600, 0.05, 'sine', 0.1);
}

export function playTimerWarning() {
  playSequence([
    { freq: 880, dur: 0.08, delay: 0 },
    { freq: 880, dur: 0.08, delay: 0.15 },
    { freq: 880, dur: 0.08, delay: 0.3 },
  ], 'square', 0.15);
}
