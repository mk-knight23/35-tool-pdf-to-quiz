# Development Guide

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mk-knight37/quizflow-pdf-quiz-generator.git
cd quizflow-pdf-quiz-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start optional backend server

## Project Structure

- `src/components/` - React components
- `src/services/` - Business logic and API calls
- `src/stores/` - Zustand state management
- `src/types/` - TypeScript interfaces
- `src/hooks/` - Custom React hooks
- `docs/` - Documentation

## Coding Standards

### TypeScript
- All code must be typed
- Avoid `any` types
- Use interfaces for object shapes
- Provide return types for functions

### React
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused (<400 lines)
- Extract reusable logic into custom hooks

### State Management
- Use Zustand for global state
- Keep state minimal and flat
- Persist only necessary data to localStorage

### Styling
- Use Tailwind utility classes
- Follow the Black & White Editorial theme
- Respect focus mode constraints
- Ensure dark/light theme compatibility

## Adding Features

1. **New Component**: Create in `src/components/`
2. **New Service**: Add to `src/services/`
3. **State Updates**: Update relevant store in `src/stores/`
4. **New Types**: Add to `src/types/`

## Testing

Before committing:
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Features work in both light and dark themes
- [ ] Focus mode works correctly

## Build Process

The build process:
1. TypeScript compilation (`tsc -b`)
2. Vite bundling
3. Static file generation
4. Optimized for deployment

## Debugging

### View State
Open browser DevTools Console:
```javascript
// View localStorage
localStorage.getItem('quizflow-storage')
localStorage.getItem('quizflow-settings')
localStorage.getItem('quizflow-stats')
```

### Clear All Data
```javascript
localStorage.clear()
location.reload()
```

## Common Issues

### PDF Not Processing
- Ensure PDF is text-based (not scanned)
- Check file size < 10MB
- Verify PDF.js worker loads correctly

### API Errors
- Check OpenRouter API key is valid
- Verify API credit balance
- Check network requests in DevTools

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`
- Check TypeScript version compatibility

## Deployment

### GitHub Pages
1. Push to `main` branch
2. Enable GitHub Pages in settings
3. Set source to "GitHub Actions"

### Vercel/Netlify
1. Connect repository
2. Auto-deploys on push to `main`
3. No configuration needed

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Keep PRs focused and small
