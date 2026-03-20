# QuizFlow Architecture

## System Overview

QuizFlow is a client-side React application that generates interactive quizzes from PDF documents using AI.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand (with localStorage persistence)
- **Styling**: Tailwind CSS 4 with custom design system
- **Animations**: Framer Motion
- **PDF Processing**: PDF.js (client-side)
- **AI Integration**: OpenRouter API
- **Icons**: Lucide React

## Directory Structure

```
src/
├── components/          # React components
│   ├── QuizGenerator.tsx   # Main quiz generation UI
│   └── SettingsPanel.tsx   # Settings and configuration
├── services/           # Business logic and external APIs
│   ├── aiService.ts        # PDF processing + AI quiz generation
│   └── backendService.ts   # Optional backend integration
├── stores/             # Zustand state management
│   ├── settings.ts         # App settings (theme, focus mode)
│   ├── quizStore.ts        # Quiz data and user preferences
│   └── stats.ts            # Usage statistics
├── types/              # TypeScript type definitions
│   └── quiz.ts             # Quiz, Question, QuizSettings interfaces
├── hooks/              # Custom React hooks
│   └── useAudio.ts         # Sound effects
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Design system styles
```

## Core Data Flow

```
User uploads PDF
    ↓
PDF.js extracts text
    ↓
OpenRouter AI generates quiz
    ↓
User reviews and customizes
    ↓
Quiz saved to localStorage
    ↓
User takes quiz
    ↓
Results displayed with explanations
```

## State Management

### QuizStore
- Manages quiz data (quizzes array)
- Handles quiz generation settings
- Persists to localStorage via Zustand middleware

### SettingsStore
- Manages app preferences (theme, sound, focus mode)
- Handles theme application (dark/light)
- Persists to localStorage

### StatsStore
- Tracks usage statistics
- Records quiz creation counts
- Measures time spent in app

## Design System

### Black & White Editorial Theme
- Typography-focused with serif headings (Georgia)
- Monochromatic palette (black, white, grays)
- Minimal rounded corners (2-6px)
- Print-inspired aesthetic

### Focus Mode (Intentional Constraint)
- 66 character max line width
- Monospace-only interface
- Reduced motion and visual distractions
- Creates distinctive typewriter feel

## Key Features

### Client-Side PDF Processing
- PDF.js extracts text from uploaded PDFs
- No server-side processing required
- Works with text-based PDFs only

### AI Quiz Generation
- Sends extracted text to OpenRouter API
- Configurable question count (1-20)
- Difficulty levels (easy, medium, hard)
- Automatic retry with exponential backoff

### Data Management
- Export all quizzes to JSON
- Import quizzes from JSON backup
- Optional backend sync (server.js)
- Graceful degradation when offline

## Deployment

The app is designed for static deployment:
- GitHub Pages (via GitHub Actions)
- Vercel
- Netlify

No build-time server required. Optional backend server (`server.js`) provides:
- Quiz backup
- Anonymous analytics
- Data sync across devices
