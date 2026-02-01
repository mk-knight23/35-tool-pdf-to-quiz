/**
 * Lightweight Backend API for QuizFlow
 *
 * This is an OPTIONAL backend that provides:
 * - Quiz backup and persistence
 * - Usage analytics
 * - Data export/import
 *
 * Run with: node server.js
 * Requires: npm install express cors
 */

import express from 'express'
import cors from 'cors'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3001
const DATA_DIR = path.join(process.cwd(), 'data')

// Middleware
app.use(cors())
app.use(express.json())

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * GET /api/quizzes
 * Get all saved quizzes (server-side backup)
 */
app.get('/api/quizzes', async (req, res) => {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, 'quizzes.json')

    if (!existsSync(filePath)) {
      return res.json([])
    }

    const data = await readFile(filePath, 'utf-8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({ error: 'Failed to read quizzes' })
  }
})

/**
 * POST /api/quizzes/backup
 * Backup quizzes to server storage
 */
app.post('/api/quizzes/backup', async (req, res) => {
  try {
    await ensureDataDir()
    const { quizzes } = req.body
    const filePath = path.join(DATA_DIR, 'quizzes.json')

    // Read existing quizzes
    let existingQuizzes = []
    if (existsSync(filePath)) {
      const data = await readFile(filePath, 'utf-8')
      existingQuizzes = JSON.parse(data)
    }

    // Merge quizzes (avoid duplicates by ID)
    const quizzesMap = new Map()
    existingQuizzes.forEach(q => quizzesMap.set(q.id, q))
    quizzes.forEach(q => quizzesMap.set(q.id, q))

    const mergedQuizzes = Array.from(quizzesMap.values())
    await writeFile(filePath, JSON.stringify(mergedQuizzes, null, 2))

    res.json({ success: true, count: mergedQuizzes.length })
  } catch (error) {
    res.status(500).json({ error: 'Failed to backup quizzes' })
  }
})

/**
 * POST /api/analytics
 * Track usage analytics (anonymous)
 */
app.post('/api/analytics', async (req, res) => {
  try {
    await ensureDataDir()
    const { event, data } = req.body
    const filePath = path.join(DATA_DIR, 'analytics.json')

    let analytics = []
    if (existsSync(filePath)) {
      const fileData = await readFile(filePath, 'utf-8')
      analytics = JSON.parse(fileData)
    }

    analytics.push({
      event,
      data,
      timestamp: new Date().toISOString()
    })

    await writeFile(filePath, JSON.stringify(analytics, null, 2))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to record analytics' })
  }
})

/**
 * DELETE /api/data
 * Clear all server data
 */
app.delete('/api/data', async (req, res) => {
  try {
    await ensureDataDir()
    // Keep the files but clear their content
    await writeFile(path.join(DATA_DIR, 'quizzes.json'), '[]')
    await writeFile(path.join(DATA_DIR, 'analytics.json'), '[]')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear data' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`QuizFlow backend server running on http://localhost:${PORT}`)
  console.log(`Data directory: ${DATA_DIR}`)
})
