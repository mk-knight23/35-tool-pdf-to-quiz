# AI-Enhanced PDF Quiz Generator

This application uses AI to generate interactive quizzes from PDF documents, with enhanced features and improved interactivity.

## Features

- **OpenRouter Integration**: Utilizes OpenRouter's API to access multiple high-quality language models including Claude 3.5 Sonnet, GPT-4, and Llama models
- **PDF Preview**: Shows a preview of the document content after upload
- **Model Selection**: Choose from different AI models for quiz generation
- **Customizable Questions**: Generate between 2-10 questions (default is 4)
- **Interactive Quiz Experience**:
  - Timed questions with countdown (2 minutes per question)
  - Keyboard navigation (number keys 1-4 to select answers)
  - Question bookmarking
  - Performance analytics
  - Share quiz results
- **Enhanced Review**: Detailed review with time tracking and bookmark indicators

## Technology

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn/UI
- **Animations**: Framer Motion
- **AI Provider**: OpenRouter API

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

The application requires an OpenRouter API key to function. This key should be added to a `.env.local` file in the project root:

```
OPENROUTER_API_KEY=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
```

Alternatively, you can create your own API key at [OpenRouter](https://openrouter.ai) and use that instead.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Upload PDF**: Drag and drop or select a PDF file (up to 5MB)
2. **Preview Content**: View basic information about the document
3. **Customize**: Select the number of questions and AI model (free OpenRouter models only)
4. **Generate Quiz**: The AI analyzes the document and creates a quiz
5. **Take Quiz**: Answer questions with keyboard or mouse
6. **Review Results**: See detailed results with performance analytics

## Implementation Details

- The application uses a custom OpenRouter client (`lib/openrouter.ts`) to handle API calls
- The quiz component (`components/quiz.tsx`) provides an interactive experience with timers and navigation
- The PDF preview component (`components/pdf-preview.tsx`) shows basic file information
- The enhanced quiz overview shows time tracking and bookmarking information
- The application uses only free OpenRouter models to ensure accessibility

## License

This project is licensed under the MIT License.
