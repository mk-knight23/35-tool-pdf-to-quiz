import { useRef, useEffect, useCallback } from 'react'
import { useSettingsStore } from '@/stores/settings'

export function useAudio() {
  const settings = useSettingsStore()
  const audioContextRef = useRef<AudioContext | null>(null)
  const enabled = settings.soundEnabled

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) => {
    if (!enabled) return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)

      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch {
      console.warn('Audio playback failed')
    }
  }, [enabled])

  const playClick = () => playTone(800, 0.05, 'sine', 0.2)
  const playHover = () => playTone(600, 0.03, 'sine', 0.1)
  const playSuccess = () => {
    playTone(523.25, 0.1, 'sine', 0.3)
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.3), 100)
    setTimeout(() => playTone(783.99, 0.15, 'sine', 0.3), 200)
  }
  const playError = () => playTone(200, 0.2, 'sawtooth', 0.2)

  useEffect(() => {
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  return { playClick, playHover, playSuccess, playError, isEnabled: enabled }
}
