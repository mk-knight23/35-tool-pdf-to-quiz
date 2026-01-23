# QuizFlow AI - PDF to Quiz Generator

A professional web application that transforms PDF documents into interactive, AI-powered quizzes. Built with React 18, TypeScript, and Tailwind CSS.

## Features

- **PDF Text Extraction** - Automatically parses text from uploaded PDF files using PDF.js.
- **AI-Powered Generation** - Leverages LLMs via OpenRouter to create relevant multiple-choice questions.
- **Interactive Quiz UI** - Modern, clean interface for taking quizzes with real-time feedback.
- **Instant Explanations** - Get detailed explanations for every answer to enhance learning.
- **Local Persistence** - Saves your quiz history and settings directly in your browser.
- **Privacy First** - All processing happens in the browser; API keys are never stored on a server.
- **Customizable** - Adjust the number of questions, difficulty level, and AI model.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **PDF.js** - PDF processing
- **OpenRouter API** - AI integration
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- An [OpenRouter API Key](https://openrouter.ai/keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/37-PDF-to-Quiz-Generator.git

# Navigate to project
cd 37-PDF-to-Quiz-Generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Open the application.
2. Click the **Settings** icon.
3. Enter your **OpenRouter API Key**.
4. Upload a PDF and click **Generate Quiz**.

## Project Structure

```
37-PDF-to-Quiz-Generator/
├── src/
│   ├── components/
│   │   ├── QuizGenerator.tsx # Core logic
│   │   └── Settings.tsx      # Config modal
│   ├── services/
│   │   └── aiService.ts      # AI & PDF logic
│   ├── stores/
│   │   └── quizStore.ts      # Zustand state
│   ├── types/
│   │   └── quiz.ts           # TS interfaces
│   ├── App.tsx               # Main layout
│   └── index.css             # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Deployment

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Enable GitHub Pages in repository settings.
2. Set source to "GitHub Actions".
3. Push to the `main` branch to trigger deployment.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Live Demo:** [https://mk-knight23.github.io/37-PDF-to-Quiz-Generator/](https://mk-knight23.github.io/37-PDF-to-Quiz-Generator/)
