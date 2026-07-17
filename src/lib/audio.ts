"use client";

import { useCallback, useEffect, useRef } from "react";
import { getSoundEnabled } from "./prefs";

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Tiny Web Audio tone synth for optional click/success/error feedback (ported from
 * legacy useAudio). Respects the local sound preference; fully silent when disabled.
 */
export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.25) => {
      if (typeof window === "undefined" || !getSoundEnabled()) return;
      try {
        if (!ctxRef.current) {
          const Ctx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
          if (!Ctx) return;
          ctxRef.current = new Ctx();
        }
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio is a non-essential enhancement */
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return {
    playClick: () => playTone(760, 0.05, "sine", 0.15),
    playCorrect: () => {
      playTone(523.25, 0.09, "sine", 0.22);
      setTimeout(() => playTone(659.25, 0.11, "sine", 0.22), 90);
    },
    playWrong: () => playTone(200, 0.18, "sawtooth", 0.16),
  };
}
