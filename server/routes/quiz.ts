import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { mapQuizForFrontend } from '../lib/mappers.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/quizzes/:quizId', async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.quizId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          options: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  });

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  res.json(mapQuizForFrontend(quiz));
});

router.get('/topics/:topicId/quizzes', async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    where: { topicId: req.params.topicId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          options: { orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  });

  res.json(quizzes.map(mapQuizForFrontend));
});

router.post('/quizzes/:quizId/attempt', requireAuth, async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.auth!.userId } });
  if (!student) {
    return res.status(403).json({ error: 'Student profile required' });
  }

  const responses = (req.body.responses ?? []) as Array<{
    questionId: string;
    selectedOptionId?: string;
  }>;

  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.quizId },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  const previousAttempts = await prisma.quizAttempt.count({
    where: { studentId: student.id, quizId: quiz.id },
  });

  let score = 0;
  const totalMarks = quiz.questions.reduce((sum, question) => sum + question.marks, 0);

  const attempt = await prisma.quizAttempt.create({
    data: {
      studentId: student.id,
      quizId: quiz.id,
      attemptNumber: previousAttempts + 1,
      completedAt: new Date(),
    },
  });

  for (const response of responses) {
    const question = quiz.questions.find((item) => item.id === response.questionId);
    if (!question) continue;

    const selectedOption = question.options.find((option) => option.id === response.selectedOptionId);
    const isCorrect = Boolean(selectedOption?.isCorrect);
    if (isCorrect) score += question.marks;

    await prisma.quizQuestionResponse.create({
      data: {
        attemptId: attempt.id,
        questionId: question.id,
        selectedOptionId: response.selectedOptionId,
        isCorrect,
        marksAwarded: isCorrect ? question.marks : 0,
      },
    });
  }

  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  const passed = percentage >= quiz.passingScore;

  await prisma.quizAttempt.update({
    where: { id: attempt.id },
    data: { score, passed },
  });

  const result = await prisma.quizResult.create({
    data: {
      attemptId: attempt.id,
      studentId: student.id,
      quizId: quiz.id,
      score,
      percentage,
      passed,
    },
  });

  res.json({
    quizId: quiz.id,
    title: quiz.title,
    score,
    totalQuestions: quiz.questions.length,
    percentage,
    passed,
    resultId: result.id,
  });
});

router.get('/students/:studentId/quiz-results', requireAuth, async (req, res) => {
  const results = await prisma.quizResult.findMany({
    where: { studentId: req.params.studentId },
    include: { quiz: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(
    results.map((result) => ({
      quizId: result.quizId,
      title: result.quiz.title,
      score: result.score,
      totalQuestions: 0,
      timeTakenSeconds: 0,
      date: result.createdAt.toISOString(),
      incorrectAnswersDetails: [],
    }))
  );
});

export default router;
