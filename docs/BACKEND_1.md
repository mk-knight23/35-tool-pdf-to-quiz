# Backend Server (Optional)

QuizFlow works fully client-side, but includes an **optional** backend server for enhanced features.

## Running the Backend

1. Install dependencies:
```bash
npm install express cors
```

2. Start the server:
```bash
npm run server
```

The server will run on `http://localhost:3001`

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T00:00:00.000Z"
}
```

### GET /api/quizzes
Get all saved quizzes from server storage.

**Response:**
```json
[
  {
    "id": "abc123",
    "title": "Quiz Title",
    "questions": [...],
    "createdAt": "2026-02-02T00:00:00.000Z",
    "pdfName": "document.pdf"
  }
]
```

### POST /api/quizzes/backup
Backup quizzes to server storage.

**Request:**
```json
{
  "quizzes": [...]
}
```

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

### POST /api/analytics
Track anonymous usage analytics.

**Request:**
```json
{
  "event": "quiz_created",
  "data": {
    "numQuestions": 5,
    "difficulty": "medium"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

### DELETE /api/data
Clear all server data.

**Response:**
```json
{
  "success": true
}
```

## Data Storage

Server data is stored in the `data/` directory:
- `quizzes.json` - Quiz backups
- `analytics.json` - Anonymous usage events

## Environment Variables

Configure the backend URL:

```bash
# .env.local
VITE_API_URL=http://localhost:3001
```

## Client-Side Integration

The app gracefully handles backend unavailability. All features work client-side, with optional enhancements when backend is available:

- Quiz backup to server
- Cross-device sync
- Analytics tracking

## Production Deployment

For production, consider:
1. Deploying the backend to a server (e.g., Railway, Render)
2. Adding authentication for user-specific data
3. Implementing rate limiting
4. Adding database storage (PostgreSQL, MongoDB)
