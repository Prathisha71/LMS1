import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import academicRoutes from './routes/academic.js';
import courseRoutes from './routes/course.js';
import quizRoutes from './routes/quiz.js';
import assignmentRoutes from './routes/assignment.js';
import progressRoutes from './routes/progress.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'eduverse-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api', academicRoutes);
app.use('/api', courseRoutes);
app.use('/api', quizRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', progressRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`EduVerse API running at http://localhost:${port}/api`);
});
