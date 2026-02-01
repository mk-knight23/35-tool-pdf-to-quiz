import * as pdfjs from 'pdfjs-dist'

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

// Retry utility with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // Retry on server errors (5xx) or rate limits (429)
      if (response.status >= 500 || response.status === 429) {
        const error = new Error(`API returned ${response.status}`)
        lastError = error

        // Don't retry on the last attempt
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }

      return response
    } catch (error) {
      lastError = error as Error

      // Retry on network errors
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((item: any) => item.str)
    fullText += strings.join(' ') + '\n'
  }

  return fullText
}

export async function generateQuizFromAI(
  text: string,
  apiKey: string,
  model: string,
  numQuestions: number,
  difficulty: string
): Promise<any> {
  if (!apiKey) throw new Error('API Key is required')

  const prompt = `
    You are an expert quiz generator. Generate a multiple-choice quiz based on the following text.
    The quiz should have ${numQuestions} questions.
    Difficulty level: ${difficulty}.

    Return ONLY a JSON object with the following structure:
    {
      "title": "Quiz Title",
      "questions": [
        {
          "question": "Question text?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": 0,
          "explanation": "Why this is correct"
        }
      ]
    }

    Text content:
    ${text.substring(0, 8000)}
  `

  const response = await fetchWithRetry(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/mk-knight23/pdf-to-quiz-generator',
        'X-Title': 'QuizFlow AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    },
    3 // Max 3 retries
  )

  const data = await response.json()
  if (data.error) throw new Error(data.error.message || 'AI Generation failed')

  const content = data.choices[0].message.content
  return JSON.parse(content)
}
