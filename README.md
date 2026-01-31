# QuizFlow AI — PDF to Quiz Generator

A professional web application that transforms PDF documents into interactive, AI-powered quizzes.

---

## What It Does

QuizFlow AI extracts text content from PDF documents and uses large language models to generate comprehensive multiple-choice quizzes. Each question includes explanations, making it an effective learning tool for students, educators, and professionals.

**When to use this tool:**
- Converting lecture notes, articles, or study materials into practice quizzes
- Creating assessments from documentation or technical papers
- Testing comprehension of uploaded documents
- Generating study materials from research papers

---

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| PDF File | File | Any PDF document (max 10MB) |
| API Key | String | OpenRouter API key for AI generation |
| AI Model | Select | Choose from free/paid models |
| Question Count | Number | 1-20 questions per quiz |
| Difficulty | Select | Easy, Medium, or Hard |

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Quiz Title | String | AI-generated title based on content |
| Questions | Array | Multiple-choice questions with 4 options each |
| Explanations | String | Detailed explanation for each answer |
| Score | Number | Final score upon completion |

---

## Workflow Steps

1. **Configure API Key** — Click settings and enter your OpenRouter API key
2. **Upload PDF** — Drag & drop or select a PDF file (max 10MB, text-based only)
3. **Generate Quiz** — Click "Generate Quiz" and watch the progress
4. **Preview & Customize** — Review generated questions, remove any you don't want
5. **Take Quiz** — Answer each multiple-choice question
6. **Review Results** — See your score with detailed explanations

---

## Stack Choice Rationale

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI with hooks for state management |
| TypeScript | Type safety for quiz data structures |
| Vite | Fast development server and optimized builds |
| Tailwind CSS 4 | Utility-first styling with custom design system |
| Zustand | Lightweight state management without boilerplate |
| Framer Motion | Smooth, accessible transitions and animations |
| PDF.js | Client-side PDF text extraction |
| Lucide React | Clean, consistent SVG icons |

---

## Setup Steps

```bash
# Clone the repository
git clone https://github.com/mk-knight23/37-PDF-to-Quiz-Generator.git
cd 37-PDF-to-Quiz-Generator

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

### Environment Variables (Optional)

Create a `.env.local` file for default configuration:

```bash
VITE_OPENROUTER_API_KEY=your_key_here
VITE_DEFAULT_MODEL=google/gemini-flash-1.5-8b:free
```

---

## Limitations

- **PDF Size**: Maximum 10MB file size
- **Text Extraction**: Scanned/image-based PDFs are not supported (text-based only)
- **API Rate Limits**: Dependent on OpenRouter account tier
- **Question Accuracy**: AI-generated questions require review for critical applications
- **Browser Storage**: Quiz history stored in localStorage (cleared on browser data deletion)
- **No Question Editing**: You can remove unwanted questions, but cannot edit question text or answers (by design — keeps the tool simple)

---

## Project Structure

```
35-tool-pdf-to-quiz/
├── design-system/
│   └── MASTER.md              # Black & White editorial theme specification
├── src/
│   ├── components/
│   │   ├── QuizGenerator.tsx  # Core quiz generation and display
│   │   └── SettingsPanel.tsx  # API configuration and preferences
│   ├── services/
│   │   └── aiService.ts       # PDF parsing and AI integration
│   ├── stores/
│   │   ├── settings.ts        # User preferences
│   │   ├── quizStore.ts       # Quiz state management
│   │   └── stats.ts           # Usage statistics
│   ├── types/
│   │   └── quiz.ts            # TypeScript interfaces
│   ├── hooks/
│   │   └── useAudio.ts        # Sound effects
│   ├── App.tsx                # Main layout
│   ├── main.tsx               # Entry point
│   └── index.css              # Design system styles
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deployment
├── vercel.json                # Vercel deployment config
├── netlify.toml               # Netlify deployment config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design System

This application follows a **Black & White Editorial** design theme:
- Typography-focused with serif headings (Georgia, Tiémpos)
- Monochromatic color palette with high contrast
- Minimal rounded corners (2-6px)
- Clean borders and subtle shadows
- Print-inspired aesthetic

See `design-system/MASTER.md` for complete design specifications.

---

## Deployment

This project includes deployment configurations for all three platforms:

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
