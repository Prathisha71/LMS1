import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { mapUserProfile } from '../lib/mappers.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

async function loadUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: {
        include: {
          analytics: true,
          learningStreak: true,
        },
      },
      teacherProfile: true,
      adminProfile: true,
    },
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await loadUser(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ userId: user.id, role: user.role });
  const profile = mapUserProfile({
    ...user,
    studentProfile: user.studentProfile,
  });

  return res.json({
    token,
    user: profile,
    role: user.role.toLowerCase(),
  });
});

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, role, boardId, classId } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    boardId?: string;
    classId?: string;
  };

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userRole = role.toUpperCase() as 'STUDENT' | 'TEACHER' | 'ADMIN';

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: userRole,
      ...(userRole === 'STUDENT' && boardId && classId
        ? {
            studentProfile: {
              create: {
                boardId,
                classId,
                analytics: { create: { xp: 100 } },
                learningStreak: { create: { currentStreak: 1, longestStreak: 1 } },
              },
            },
          }
        : {}),
      ...(userRole === 'TEACHER'
        ? {
            teacherProfile: {
              create: {
                bio: 'EduVerse instructor',
                qualification: 'Subject expert',
              },
            },
          }
        : {}),
      ...(userRole === 'ADMIN'
        ? {
            adminProfile: {
              create: { dept: 'Operations' },
            },
          }
        : {}),
    },
    include: {
      studentProfile: {
        include: {
          analytics: true,
          learningStreak: true,
        },
      },
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  const profile = mapUserProfile({
    ...user,
    studentProfile: user.studentProfile,
  });

  return res.status(201).json({ token, user: profile, role: user.role.toLowerCase() });
});

router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

export default router;
