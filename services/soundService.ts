import * as Tone from 'tone';

let synth: Tone.Synth;
let metalSynth: Tone.MetalSynth;
let membraneSynth: Tone.MembraneSynth;
let isInitialized = false;

export const init = () => {
  if (isInitialized) return;
  
  synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
  }).toDestination();
  
  metalSynth = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toDestination();
  
  membraneSynth = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0.01, release: 0.5 }
  }).toDestination();

  isInitialized = true;
};

const startAudio = async () => {
    if (Tone.context.state !== 'running') {
        await Tone.start();
    }
};

export const playClick = () => {
  if (!isInitialized || Tone.context.state !== 'running') return;
  metalSynth.triggerAttackRelease('C4', '32n');
};

export const playMove = () => {
  if (!isInitialized || Tone.context.state !== 'running') return;
  membraneSynth.triggerAttackRelease('C2', '20n');
};

export const playWin = () => {
  if (!isInitialized || Tone.context.state !== 'running') return;
  const now = Tone.now();
  synth.triggerAttackRelease('C4', '8n', now);
  synth.triggerAttackRelease('E4', '8n', now + 0.2);
  synth.triggerAttackRelease('G4', '8n', now + 0.4);
  synth.triggerAttackRelease('C5', '4n', now + 0.6);
};

export const toggleMute = (isMuted: boolean) => {
    if (!isInitialized) return;
    if (isMuted) {
        Tone.getDestination().mute = true;
    } else {
        startAudio().then(() => {
            Tone.getDestination().mute = false;
        });
    }
};