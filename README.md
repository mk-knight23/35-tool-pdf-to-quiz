# QuizFlow AI — PDF to Quiz Generator

Transform any PDF document into an interactive multiple-choice quiz using AI. A production-grade, fault-tolerant tool designed for students, educators, and lifelong learners.

![QuizFlow Banner](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80)

## 🚀 Features

- **PDF Text Extraction**: Instant local extraction using `pdfjs-dist`.
- **AI-Powered Generation**: Leverages OpenRouter API (OpenAI, Anthropic, etc.) for high-quality quiz content.
- **Fault Tolerant**: Built-in error boundaries, retry logic with exponential backoff, and toast notifications.
- **Enterprise Architecture**: TypeScript backend with structured pino logging and envalid configuration.
- **Rich UI/UX**: Dark mode support, smooth animations with framer-motion, and mobile-responsive design.
- **Data Persistence**: Backup quizzes to a local server or export to JSON for offline storage.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript 5.6.2, Tailwind CSS v4, Lucide React 0.563.0, Zustand 5.0.2.
- **Backend**: Node.js, Express 4.18.2, TypeScript, pino 10.3.0 (Logging), envalid 8.1.1 (Config).
- **AI**: OpenRouter API (OpenAI, Anthropic, etc.).
- **PDF**: PDF.js 4.8.69.

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│  React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand     │
│  + Framer Motion + Lucide React + React Router 7              │
└─────────────────────────────────────────────────────────────────┘
                            ↓ (HTTP/JSON)
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Express)                       │
│  Express + TypeScript + Pino Logging + Envalid Config          │
│  + Error Handling + CORS + Graceful Degradation                │
└─────────────────────────────────────────────────────────────────┘
                            ↓ (REST API)
┌─────────────────────────────────────────────────────────────────┐
│                     Data Storage (JSON Files)                    │
│  /data/quizzes.json    (Quiz backups)                          │
│  /data/analytics.json  (Analytics events)                      │
└─────────────────────────────────────────────────────────────────┘

                            ↓ (External APIs)
┌─────────────────────────────────────────────────────────────────┐
│                      OpenRouter API (AI)                        │
│  OpenAI GPT, Anthropic Claude, etc.                            │
│  Quiz generation from PDF content                              │
└─────────────────────────────────────────────────────────────────┘

                            ↓ (Local Processing)
┌─────────────────────────────────────────────────────────────────┐
│                    PDF Processing (PDF.js)                      │
│  Client-side text extraction from uploaded PDFs                │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
35-tool-pdf-to-quiz/
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Main app component
│   ├── vite-env.d.ts             # Vite type definitions
│   │
│   ├── pages/
│   │   ├── Home.tsx              # Main quiz generator page
│   │   ├── Stats.tsx             # Statistics page
│   │   └── History.tsx           # Quiz history page
│   │
│   ├── components/
│   │   ├── QuizGenerator.tsx     # Main quiz generator component
│   │   ├── SettingsPanel.tsx     # Settings panel
│   │   └── common/
│   │       └── ErrorBoundary.tsx  # Error boundary component
│   │
│   ├── services/
│   │   ├── aiService.ts          # AI quiz generation service
│   │   └── backendService.ts     # Backend communication service
│   │
│   ├── stores/
│   │   ├── quizStore.ts          # Quiz state management
│   │   ├── stats.ts              # Statistics state
│   │   └── settings.ts           # Settings state
│   │
│   ├── hooks/
│   │   └── useAudio.ts           # Custom audio hook
│   │
│   ├── types/
│   │   └── quiz.ts               # TypeScript definitions
│   │
│   └── router/
│       └── index.tsx             # React Router configuration
│
├── server/
│   ├── index.ts                  # Express server entry point
│   └── middleware/
│       └── error.ts              # Error handling middleware
│
├── data/                         # Created at runtime
│   ├── quizzes.json              # Quiz backups
│   └── analytics.json            # Analytics events
│
├── .github/workflows/
│   ├── ci.yml                    # Lint and build workflow
│   └── deploy.yml                # GitHub Pages deployment
│
├── .env                          # Environment variables (not committed)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config
├── tsconfig.server.json          # TypeScript config for server
├── vite.config.ts                # Vite config
├── index.html                    # HTML entry point
└── README.md                     # This file
```

### Frontend Architecture

```typescript
{
  ui: {
    framework: "React 18",
    language: "TypeScript 5.6.2",
    bundler: "Vite 6",
    styling: "Tailwind CSS v4",
    animations: "Framer Motion 11.15.0",
    icons: "Lucide React 0.563.0",
    router: "React Router 7.13.0",
    notifications: "React Hot Toast 2.6.0"
  },
  stateManagement: {
    primary: "Zustand 5.0.2",
    stores: [
      "quizStore: Quiz data and generation state",
      "stats: Statistics and analytics",
      "settings: User preferences and API keys"
    ],
    persistence: "localStorage for quizzes, optional backend backup"
  },
  pages: [
    {
      name: "Home",
      path: "/",
      features: ["PDF upload", "Quiz generation", "Quiz playback"]
    },
    {
      name: "Stats",
      path: "/stats",
      features: ["Performance metrics", "Quiz history"]
    },
    {
      name: "History",
      path: "/history",
      features: ["Quiz list", "Export JSON", "Clear data"]
    }
  ]
}
```

### Backend Architecture

```typescript
{
  server: {
    framework: "Express 4.18.2",
    language: "TypeScript",
    runtime: "Node.js",
    port: 3001
  },
  middleware: {
    cors: "Cross-Origin Resource Sharing",
    expressAsyncErrors: "Async error handling",
    errorHandler: "Custom error middleware"
  },
  logging: {
    library: "pino 10.3.0",
    output: "Console (structured JSON)"
  },
  configuration: {
    library: "envalid 8.1.1",
    validated: [
      "PORT: Server port (default: 3001)",
      "NODE_ENV: development/test/production"
    ]
  },
  api: {
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        description: "Health check"
      },
      {
        method: "GET",
        path: "/api/quizzes",
        description: "Get all quiz backups"
      },
      {
        method: "POST",
        path: "/api/quizzes/backup",
        description: "Backup quizzes to server"
      },
      {
        method: "POST",
        path: "/api/analytics",
        description: "Log analytics events"
      },
      {
        method: "DELETE",
        path: "/api/data",
        description: "Clear all server data"
      }
    ],
    storage: "JSON files in /data directory"
  }
}
```

### Data Flow Architecture

```
PDF Upload → PDF.js → Text Extraction → OpenRouter API → Quiz JSON
     ↓             ↓              ↓              ↓
  Client       Client       Server-side     Server-side
  Only         Only         Request         Response
     ↓                                        ↓
  Display in UI ← Zustand Store ← LocalStorage ← Optional Backend
     ↓                ↓                  ↓
  Quiz Playback    Persistence       Backup/Analytics
```

### AI Quiz Generation Architecture

```typescript
{
  aiService: {
    provider: "OpenRouter API",
    supportedModels: [
      "openai/gpt-4",
      "openai/gpt-4-turbo",
      "openai/gpt-3.5-turbo",
      "anthropic/claude-3-opus",
      "anthropic/claude-3-sonnet",
      "anthropic/claude-3-haiku"
    ],
    configuration: {
      maxRetries: 3,
      retryDelay: "Exponential backoff (1s, 2s, 4s)",
      retryOn: ["5xx errors", "429 rate limit", "Network errors"]
    },
    prompt: {
      input: "Extracted PDF text (max 8000 chars)",
      parameters: [
        "numQuestions: Number of questions to generate",
        "difficulty: easy/medium/hard",
        "model: AI model to use"
      ],
      output: "JSON object with quiz structure"
    },
    faultTolerance: {
      errorHandling: "Toast notifications",
      gracefulFallback: "LocalStorage only mode",
      networkResilience: "Retry with exponential backoff"
    }
  }
}
```

### PDF Processing Architecture

```typescript
{
  pdfProcessing: {
    library: "PDF.js 4.8.69",
    location: "Client-side (browser)",
    worker: "CDN-hosted worker (cdnjs)",
    process: [
      "Load PDF from File object",
      "Extract text from each page",
      "Combine all pages into single string",
      "Trim to 8000 characters for AI input"
    ],
    privacy: {
      dataLeavingBrowser: "Only text extracted from PDF",
      destination: "OpenRouter API for quiz generation",
      storage: "Generated quiz stored locally or backed up"
    }
  }
}
```

### State Management Architecture

```typescript
{
  stores: {
    quizStore: {
      scope: "Quiz generation and playback",
      state: {
        quizzes: "Array of Quiz objects",
        currentQuiz: "Currently active quiz",
        isGenerating: "AI generation status",
        progress: "Generation progress indicator"
      },
      persistence: "localStorage",
      backup: "Optional server backup"
    },
    stats: {
      scope: "User statistics",
      state: {
        totalQuizzes: "Number of quizzes generated",
        totalQuestions: "Total questions answered",
        correctAnswers: "Total correct answers",
        accuracy: "Percentage of correct answers"
      },
      persistence: "localStorage"
    },
    settings: {
      scope: "User preferences",
      state: {
        apiKey: "OpenRouter API key",
        model: "AI model selection",
        numQuestions: "Default question count",
        difficulty: "Default difficulty level",
        enableBackup: "Backend backup toggle"
      },
      persistence: "localStorage"
    }
  }
}
```

### Error Handling Architecture

```typescript
{
  errorHandling: {
    frontend: {
      errorBoundary: "React ErrorBoundary component",
      toast: "React Hot Toast for user notifications",
      catch: "Global error catching in services"
    },
    backend: {
      middleware: "express-async-errors",
      errorHandler: "Custom error middleware",
      response: "JSON error responses"
    },
    aiService: {
      retry: "Exponential backoff retry logic",
      timeout: "Request timeout handling",
      fallback: "Graceful degradation to local mode"
    }
  }
}
```

### Logging Architecture

```typescript
{
  logging: {
    backend: {
      library: "pino 10.3.0",
      format: "Structured JSON",
      output: "Console (stdout/stderr)",
      levels: ["info", "warn", "error", "fatal"],
      events: ["Server startup", "API requests", "Errors"]
    }
  }
}
```

### Configuration Architecture

```typescript
{
  configuration: {
    backend: {
      library: "envalid 8.1.1",
      validation: "Runtime environment validation",
      variables: [
        "PORT: Server port (required)",
        "NODE_ENV: Environment (development/test/production)"
      ]
    },
    frontend: {
      runtime: "Environment variables in .env",
      vite: {
        "VITE_API_URL": "Backend API URL",
        "VITE_": "Prefix for frontend-only variables"
      }
    }
  }
}
```

### Resilience & Graceful Degradation

```typescript
{
  resilience: {
    offlineMode: {
      enabled: true,
      features: [
        "Generate quizzes without backend",
        "Store quizzes in localStorage",
        "Continue using app offline"
      ]
    },
    networkResilience: {
      retry: "3 attempts with exponential backoff",
      timeout: "Default fetch timeout",
      fallback: "LocalStorage when backend unavailable"
    },
    faultTolerance: {
      errorBoundaries: "React ErrorBoundary",
      toastNotifications: "User-friendly error messages",
      gracefulFallback: "App remains functional on errors"
    }
  }
}
```

### Type System Architecture

```typescript
{
  types: {
    Question: {
      id: "string",
      question: "string",
      options: "string[4]",
      correctAnswer: "number (0-3)",
      explanation: "string"
    },
    Quiz: {
      id: "string (UUID)",
      title: "string",
      questions: "Question[]",
      createdAt: "string (ISO 8601)",
      pdfName: "string"
    },
    QuizSettings: {
      apiKey: "string",
      model: "string",
      numQuestions: "number",
      difficulty: "'easy' | 'medium' | 'hard'"
    }
  }
}
```

### Performance Optimizations

- **PDF Processing**: Client-side extraction with PDF.js (no server overhead)
- **AI Generation**: Retry with exponential backoff for reliability
- **State Management**: Zustand for minimal re-renders and bundle size
- **Caching**: localStorage for quizzes and settings
- **Code Splitting**: React Router lazy loading (if implemented)
- **Build Optimization**: Vite for fast HMR and production builds
- **Tailwind CSS v4**: Zero-runtime CSS generation

### Security Architecture

```typescript
{
  security: {
    apiKeys: {
      storage: "localStorage (client-side only)",
      exposure: "Never sent to backend, only to OpenRouter API",
      userControl: "User provides and manages their own API key"
    },
    cors: {
      enabled: true,
      origin: "Configured in Express middleware"
    },
    dataPrivacy: {
      pdfContent: "Sent to OpenRouter API for quiz generation",
      storage: "Quizzes stored locally or backed up to user's server"
    }
  }
}
```

### CI/CD Pipeline

```yaml
Push to main → CI Check → Build → Deploy
     ↓            ↓          ↓         ↓
  Trigger     Lint+Check   Production   GitHub Pages
              (Vite)       Build        Static Site
                            ↓
                       Backend (Manual)
```

- **CI**: Linting and build checks
- **Build**: Production-optimized bundle with Vite
- **Deploy (Frontend)**: Automatic to GitHub Pages
- **Deploy (Backend)**: Manual deployment to VPS/hosting

### Multi-Platform Deployment

| Platform | URL | Type |
|----------|-----|------|
| GitHub Pages | github.io/35-tool-pdf-to-quiz | Frontend (Static) |
| Vercel | quizflow-pdf-quiz.vercel.app | Frontend (Static) |
| Custom | quizflow.example.com | Full Stack (Frontend + Backend) |

### Use Cases

```typescript
{
  selfTesting: {
    description: "Quickly generate quizzes from lecture notes or research papers",
    workflow: [
      "Upload PDF",
      "Configure quiz settings",
      "Generate quiz with AI",
      "Take quiz and review results"
    ]
  },
  teachingAid: {
    description: "Create assessment materials from textbook chapters",
    workflow: [
      "Select PDF content",
      "Set difficulty level",
      "Generate multiple quizzes",
      "Export for classroom use"
    ]
  },
  knowledgeRetention: {
    description: "Gamify learning from long-form documentation",
    workflow: [
      "Process technical docs",
      "Generate quiz series",
      "Track progress over time",
      "Focus on weak areas"
    ]
  }
}
```

### Extension Points

```typescript
{
  newFeatures: [
    "Add support for multiple PDFs in one quiz",
    "Add quiz export to PDF format",
    "Add collaborative quiz sharing",
    "Add advanced analytics dashboard"
  ],
  newIntegrations: [
    "Add support for document types beyond PDF",
    "Add support for more AI providers",
    "Add support for different quiz formats"
  ],
  newProviders: [
    "Add local LLM support (Ollama, LM Studio)",
    "Add cloud storage backup (Google Drive, Dropbox)",
    "Add quiz sharing platform"
  ]
}
```

### Key Architectural Decisions

**Why Client-Side PDF Processing?**
- Privacy: PDF content stays on user's device until sent to AI API
- Performance: No server-side PDF processing overhead
- Reliability: Works even when backend is offline

**Why OpenRouter API?**
- Multiple AI models (OpenAI, Anthropic, etc.) via single API
- No API key storage on server (user provides their own)
- Cost control: User manages their own API usage

**Why Zustand for State Management?**
- Lightweight alternative to Redux
- Built-in localStorage persistence
- Simple API for quiz, stats, and settings state

**Why Separate Frontend & Backend?**
- Flexibility: Frontend can work standalone (offline mode)
- Scalability: Backend can be deployed independently
- Maintainability: Clear separation of concerns

**Why JSON File Storage for Backend?**
- Simplicity: No database setup required
- Portability: Easy to move data
- Sufficient for personal/small-scale use

**Why Pino for Logging?**
- Structured JSON logs
- High performance
- Production-ready

**Why Envalid for Configuration?**
- Runtime environment validation
- Type safety for config
- Fail-fast on misconfiguration

### Design Philosophy

```typescript
{
  ui: {
    style: "Modern, clean, responsive",
    features: [
      "Dark mode support",
      "Smooth animations",
      "Mobile-responsive",
      "Toast notifications"
    ]
  },
  ux: {
    faultTolerance: "App remains functional on errors",
    gracefulDegradation: "Offline mode available",
    feedback: "Toast notifications for all actions"
  },
  architecture: {
    separation: "Clear separation between frontend and backend",
    resilience: "Retry logic and error boundaries",
    flexibility: "Works with or without backend"
  }
}
```

## 📐 Architecture Notes

The following notes summarize the key architectural principles:

- **Separation of Concerns**: Services handle business logic (AI, Backend communication), Stores handle state (Zustand).
- **Resilience**: The app remains functional even if the backend is offline (graceful fallback to local storage).
- **TypeScript First**: End-to-end type safety from server to UI components.

## 📦 Setup & Installation

### 1. Clone & Install
```bash
git clone <repo-url>
cd 35-tool-quizflow-pdf-quiz-generator
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
```

### 3. Run Development Servers
```bash
# Start Frontend
npm run dev

# Start Backend (Optional, for backups)
npm run server
```

## 📐 Architecture Notes

- **Separation of Concerns**: Services handle business logic (AI, Backend communication), Stores handle state (Zustand).
- **Resilience**: The app remains functional even if the backend is offline (graceful fallback to local storage).
- **TypeScript First**: End-to-end type safety from server to UI components.

## 📝 Use Cases

- **Self-Testing**: Quickly generate quizzes from lecture notes or research papers.
- **Teaching Aid**: Create assessment materials from textbook chapters.
- **Knowledge Retention**: Gamify learning from long-form documentation.

## 🤝 Roadmap

- [ ] Support for multiple languages.
- [ ] Export quizzes to PDF format.
- [ ] Advanced analytics dashboard.

---

*Last updated: 2026-03-01*

Made by [Musharraf Kazi](https://github.com/mk-knight23)
