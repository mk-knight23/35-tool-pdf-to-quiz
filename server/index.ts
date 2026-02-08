import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { cleanEnv, port, str } from 'envalid';
import { errorHandler } from './middleware/error.js';
import pino from 'pino';

const logger = pino();

const env = cleanEnv(process.env, {
    PORT: port({ default: 3001 }),
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
});

const app = express();
const PORT = env.PORT;
const DATA_DIR = path.join(process.cwd(), 'data');

app.use(cors());
app.use(express.json());

async function ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/quizzes', async (req, res) => {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, 'quizzes.json');

    if (!existsSync(filePath)) {
        return res.json([]);
    }

    const data = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
});

app.post('/api/quizzes/backup', async (req, res) => {
    await ensureDataDir();
    const { quizzes } = req.body;
    const filePath = path.join(DATA_DIR, 'quizzes.json');

    let existingQuizzes = [];
    if (existsSync(filePath)) {
        const data = await readFile(filePath, 'utf-8');
        existingQuizzes = JSON.parse(data);
    }

    const quizzesMap = new Map();
    existingQuizzes.forEach((q: any) => quizzesMap.set(q.id, q));
    quizzes.forEach((q: any) => quizzesMap.set(q.id, q));

    const mergedQuizzes = Array.from(quizzesMap.values());
    await writeFile(filePath, JSON.stringify(mergedQuizzes, null, 2));

    res.json({ success: true, count: mergedQuizzes.length });
});

app.post('/api/analytics', async (req, res) => {
    await ensureDataDir();
    const { event, data } = req.body;
    const filePath = path.join(DATA_DIR, 'analytics.json');

    let analytics = [];
    if (existsSync(filePath)) {
        const fileData = await readFile(filePath, 'utf-8');
        analytics = JSON.parse(fileData);
    }

    analytics.push({
        event,
        data,
        timestamp: new Date().toISOString(),
    });

    await writeFile(filePath, JSON.stringify(analytics, null, 2));
    res.json({ success: true });
});

app.delete('/api/data', async (req, res) => {
    await ensureDataDir();
    await writeFile(path.join(DATA_DIR, 'quizzes.json'), '[]');
    await writeFile(path.join(DATA_DIR, 'analytics.json'), '[]');
    res.json({ success: true });
});

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`QuizFlow backend server running on http://localhost:${PORT}`);
});
