/**
 * Backend API Service
 *
 * Handles communication with the optional backend server.
 * All functions are optional and gracefully handle failures.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface AnalyticsEvent {
  event: string
  data?: Record<string, unknown>
}

/**
 * Check if backend server is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Backup quizzes to server storage
 */
export async function backupQuizzesToServer(quizzes: unknown[]): Promise<{ success: boolean; count?: number }> {
  try {
    const response = await fetch(`${API_BASE}/api/quizzes/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizzes })
    })

    if (!response.ok) throw new Error('Backup failed')

    const data = await response.json()
    return { success: true, count: data.count }
  } catch {
    return { success: false }
  }
}

/**
 * Load quizzes from server storage
 */
export async function loadQuizzesFromServer(): Promise<unknown[] | null> {
  try {
    const response = await fetch(`${API_BASE}/api/quizzes`)
    if (!response.ok) throw new Error('Load failed')

    const quizzes = await response.json()
    return quizzes
  } catch {
    return null
  }
}

/**
 * Track analytics event
 */
export async function trackAnalytics(eventData: AnalyticsEvent): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Clear all server data
 */
export async function clearServerData(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/data`, {
      method: 'DELETE'
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Export all local data to JSON file (client-side)
 */
export function exportAllData(quizzes: unknown[], stats: unknown) {
  const data = {
    version: '2.1.0',
    exportDate: new Date().toISOString(),
    quizzes,
    stats
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `quizflow-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import quizzes from JSON file
 */
export async function importQuizzesFromFile(file: File): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Handle both full backup format and quizzes-only format
        const quizzes = data.quizzes || (Array.isArray(data) ? data : [])

        if (!Array.isArray(quizzes)) {
          throw new Error('Invalid quiz data format')
        }

        resolve(quizzes)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
