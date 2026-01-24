import { useEffect, useCallback, useRef } from 'react'
import { useSettingsStore } from '@/stores/settings'
import { KEYBOARD_SHORTCUTS } from '@/utils/constants'

type KeyAction = 'new' | 'close' | 'help' | 'none'

export function useKeyboardControls() {
  const settings = useSettingsStore()
  const keysPressed = useRef<Set<string>>(new Set())
  const lastAction = useRef<KeyAction>('none')

  const actionMap: Record<string, KeyAction> = {
    KeyN: 'new',
    Escape: 'close',
    KeyH: 'help',
    Slash: 'help',
    KeyK: 'help',
    QuestionMark: 'help',
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const action = actionMap[e.key] || 'none'

    if (e.ctrlKey || e.metaKey) {
      if (action === 'new') {
        e.preventDefault()
        lastAction.current = action
        setTimeout(() => { lastAction.current = 'none' }, 100)
        return
      }
    }

    if (action === 'close' && settings.showHelp) {
      e.preventDefault()
      settings.toggleHelp()
      lastAction.current = action
      setTimeout(() => { lastAction.current = 'none' }, 100)
      return
    }

    if (action === 'help' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      settings.toggleHelp()
      lastAction.current = action
      setTimeout(() => { lastAction.current = 'none' }, 100)
      return
    }

    if (action !== 'none') {
      lastAction.current = action
      setTimeout(() => { lastAction.current = 'none' }, 100)
    }

    keysPressed.current.add(e.key)
  }, [settings])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key)
  }, [])

  const getShortcuts = useCallback(() => KEYBOARD_SHORTCUTS, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return { lastAction, getShortcuts }
}
