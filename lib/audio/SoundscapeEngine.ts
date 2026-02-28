"use client";

import { AnimationPhase } from "@/lib/animation/engine";

export class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private active = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;

      // Deep cinematic drone
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      
      this.droneOsc.type = "triangle";
      this.droneOsc.frequency.value = 45; // Deep bass
      
      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      
      this.droneGain.gain.value = 0;
      this.droneOsc.start();
      
      this.active = true;
    } catch (e) {
      console.warn("Audio Context failed to initialize", e);
    }
  }

  public update(progress: number, phase: AnimationPhase, isPlaying: boolean) {
    if (!this.ctx || !this.active || !this.droneGain || !this.droneOsc || !this.masterGain) return;

    if (!isPlaying) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      return;
    }

    this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);

    // Modulate based on phase
    let targetVol = 0;
    let targetFreq = 45;

    switch (phase) {
      case "intro":
        targetVol = 0.2;
        targetFreq = 45;
        break;
      case "fragments":
        targetVol = 0.4 + Math.sin(progress * 50) * 0.1;
        targetFreq = 55 + progress * 20;
        break;
      case "parallax":
        targetVol = 0.6;
        targetFreq = 65;
        break;
      case "merge":
        targetVol = 0.8 + (progress - 0.62) * 2; // Swell during merge
        targetFreq = 85 + (progress - 0.62) * 100;
        break;
      case "final":
      case "blueprint":
        targetVol = Math.max(0, 1 - (progress - 0.82) * 5); // Fade out
        targetFreq = 45;
        break;
    }

    this.droneGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.2);
    this.droneOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);
  }

  public stop() {
    if (!this.ctx) return;
    this.active = false;
    this.droneOsc?.stop();
    this.ctx.close();
    this.ctx = null;
  }
}

// Singleton instance
export const soundscape = typeof window !== "undefined" ? new SoundscapeEngine() : null;
