# Deploy to Vercel

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pdf-to-quiz.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variable:
   - `OPENROUTER_API_KEY` = your API key
5. Click "Deploy"

Done! Your app will be live in 2 minutes.

## Get API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up (free)
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create new key
5. Copy and use in Vercel

## Test Locally First

```bash
npm install
npm run build
npm run dev
```
