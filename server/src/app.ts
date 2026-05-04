import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import resultsRoutes from './routes/results';
import statsRoutes from './routes/stats';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/results', resultsRoutes);
app.use('/stats', statsRoutes);

export default app;
