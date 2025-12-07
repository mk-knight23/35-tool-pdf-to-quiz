# PDF to Quiz Generator

Transform any PDF into an interactive quiz using AI.

## Features

- Upload PDF documents
- AI-powered quiz generation
- Interactive quiz interface
- Instant scoring and results

## Quick Start

```bash
# Install dependencies
npm install

# Add your OpenRouter API key to .env.local
OPENROUTER_API_KEY=your_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add `OPENROUTER_API_KEY` environment variable
4. Deploy

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenRouter API
- PDF.js

## Environment Variables

```env
OPENROUTER_API_KEY=your_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get your free API key at [OpenRouter](https://openrouter.ai/keys)

## Project Structure

```
├── app/
│   ├── api/generate-quiz/  # API endpoint
│   ├── generator/          # Quiz generator page
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # UI components
│   ├── quiz.tsx          # Quiz component
│   └── pdf-preview.tsx   # PDF preview
└── lib/
    ├── openrouter.ts     # AI client
    ├── types.ts          # TypeScript types
    └── schemas.ts        # Validation
```

## License

MIT
