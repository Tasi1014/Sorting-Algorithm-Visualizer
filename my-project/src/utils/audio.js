// src/utils/audio.js

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let isMuted = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

export function toggleMute() {
  isMuted = !isMuted;
  if (!isMuted) {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
  return isMuted;
}

export function playNote(val, maxVal) {
  if (isMuted || !audioCtx) return;

  const minFreq = 200;
  const maxFreq = 1000;
  const safeMax = Math.max(maxVal || 1, 1);
  const freq = minFreq + (val / safeMax) * (maxFreq - minFreq);

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Envelope to prevent clipping/clicking
  gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}
