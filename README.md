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

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4, Lucide React, Zustand.
- **Backend**: Node.js, Express, TypeScript, pino (Logging), envalid (Config).
- **AI**: OpenRouter API.
- **PDF**: PDF.js.

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
Made by [Musharraf Kazi](https://github.com/mk-knight23)
