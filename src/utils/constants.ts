export const STORAGE_KEYS = {
  SETTINGS: 'quizflow-settings',
  STATS: 'quizflow-stats',
  QUIZZES: 'quizflow-quizzes',
} as const

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + N', action: 'New Quiz' },
  { key: 'Escape', action: 'Close Settings' },
  { key: 'H', action: 'Toggle Help' },
  { key: '?', action: 'Show Shortcuts' },
] as const
