# QuizFlow PDF Quiz Generator

A professional web application that transforms PDF documents into interactive, AI-powered quizzes.

---

## Overview

QuizFlow extracts text content from PDF documents and uses large language models to generate comprehensive multiple-choice quizzes. Each question includes explanations, making it an effective learning tool for students, educators, and professionals.

**When to use this tool:**
- Converting lecture notes, articles, or study materials into practice quizzes
- Creating assessments from documentation or technical papers
- Testing comprehension of uploaded documents
- Generating study materials from research papers

---

## Features

### Core Functionality
- **PDF Upload**: Drag & drop PDF files (max 10MB, text-based)
- **AI Quiz Generation**: Configurable question count (1-20) and difficulty
- **Preview & Customize**: Review questions and remove unwanted ones before saving
- **Interactive Quiz**: Keyboard shortcuts (1-4 for answers, Enter to submit)
- **Results with Explanations**: Detailed feedback for each question

### Advanced Features
- **Quiz Sharing**: Generate shareable URLs with encoded quiz data
- **Export to JSON**: Backup individual quizzes or all data
- **Search & Filter**: Find quizzes in your history
- **Import/Export**: Full data backup and restore
- **Focus Mode**: Intentional design constraint for deep work (66ch line width, monospace-only)

### Theming
- **Light & Dark Themes**: Full theme support with system preference detection
- **Focus Mode**: Monospace interface with reduced distractions
- **Black & White Editorial**: Print-inspired design system

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI with hooks |
| TypeScript | Type safety for quiz data structures |
| Vite | Fast development server and optimized builds |
| Tailwind CSS 4 | Utility-first styling with custom design system |
| Zustand | Lightweight state management with localStorage persistence |
| Framer Motion | Smooth, accessible transitions and animations |
| PDF.js | Client-side PDF text extraction |
| Lucide React | Clean, consistent SVG icons |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mk-knight23/quizflow-pdf-quiz-generator.git
cd quizflow-pdf-quiz-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### API Key Configuration

1. Visit [OpenRouter](https://openrouter.ai/keys) to obtain an API key
2. Click the settings icon in the app
3. Enter your API key (stored locally in browser)

---

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System architecture, data flow, and design patterns
- **[Backend Guide](docs/BACKEND.md)** - Optional backend server setup and API documentation
- **[Development Guide](docs/DEVELOPMENT.md)** - Coding standards, testing, and contribution guidelines

---

## Limitations

- **PDF Size**: Maximum 10MB file size
- **Text Extraction**: Scanned/image-based PDFs are not supported (text-based only)
- **API Rate Limits**: Dependent on OpenRouter account tier
- **Question Accuracy**: AI-generated questions require review for critical applications
- **Browser Storage**: Quiz history stored in localStorage (cleared on browser data deletion)

---

## Recent Upgrades (v2.2.0)

### Iteration 1: Audit & Cleanup
- Improved repository naming to semantic convention
- Removed unused state properties and dead code
- Clean build with no errors

### Iteration 2: Feature Expansion
- Quiz sharing via URL (encodes quiz data in hash)
- Export quiz to JSON file
- Search quizzes by title and PDF name
- Filter by date (all, recent, oldest)
- Auto-load shared quizzes from URL

### Iteration 3: Backend Introduction
- Optional Node.js/Express API server
- Client-side export/import of all data
- Data management UI in Settings panel
- Graceful degradation when backend is unavailable

### Iteration 4: UI, Theming & Humanization
- Focus Mode with 66 character line width constraint
- Monospace-only interface option
- Enhanced visual identity
- Intentional design quirk for personality

### Iteration 5: Structure & Documentation
- Created comprehensive /docs folder
- Architecture documentation
- Backend API documentation
- Development guide with coding standards

---

## Project Structure

```
35-tool-quizflow-pdf-quiz-generator/
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md          # System architecture
│   ├── BACKEND.md               # Backend server guide
│   └── DEVELOPMENT.md           # Development guide
├── design-system/
│   └── MASTER.md                # Design system specification
├── src/
│   ├── components/
│   │   ├── QuizGenerator.tsx    # Main quiz UI
│   │   └── SettingsPanel.tsx    # Settings & data management
│   ├── services/
│   │   ├── aiService.ts         # PDF + AI integration
│   │   └── backendService.ts    # Optional backend API
│   ├── stores/
│   │   ├── settings.ts          # App preferences
│   │   ├── quizStore.ts         # Quiz state
│   │   └── stats.ts             # Usage statistics
│   ├── types/
│   │   └── quiz.ts              # TypeScript interfaces
│   ├── hooks/
│   │   └── useAudio.ts          # Sound effects
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Design system styles
├── server.js                    # Optional backend server
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Deployment

### GitHub Pages
- Push to `main` branch triggers automatic deployment
- Enable GitHub Pages in repository settings with source set to "GitHub Actions"

### Vercel
- Connected via `vercel.json` configuration
- Auto-deploys on push to `main`

### Netlify
- Connected via `netlify.toml` configuration
- Auto-deploys on push to `main`

## Live Links

- **GitHub Pages**: [https://mk-knight23.github.io/37-PDF-to-Quiz-Generator/](https://mk-knight23.github.io/37-PDF-to-Quiz-Generator/)
- **Vercel**: [https://quizflow-ai.vercel.app](https://quizflow-ai.vercel.app)
- **Netlify**: [https://quizflow-ai.netlify.app](https://quizflow-ai.netlify.app)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
