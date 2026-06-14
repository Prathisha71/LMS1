import { PrismaClient, UserRole, QuestionType, LiveClassStatus, AttendanceStatus, NotificationType, BillingPeriod, SubscriptionStatus, PaymentStatus, PaymentGateway, SubmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { initialBoards } from './tnsb-data';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'password123';

async function main() {
  console.log('Starting seed...');
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  console.log('Cleaning up existing database records...');
  await prisma.subjectStatistics.deleteMany({});
  await prisma.learningStreak.deleteMany({});
  await prisma.studentAnalytics.deleteMany({});
  await prisma.studentTopicProgress.deleteMany({});
  await prisma.studentChapterProgress.deleteMany({});
  await prisma.studentSubjectProgress.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.quizOption.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.courseNote.deleteMany({});
  await prisma.courseVideo.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.userRoleJoin.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.board.deleteMany({});


  // ==========================================
  // 1. SEED PERMISSIONS
  // ==========================================
  console.log('Seeding permissions...');
  const permissionsList = [
    { name: 'academic:read', description: 'Can read academic structure' },
    { name: 'academic:write', description: 'Can edit academic structure' },
    { name: 'course:read', description: 'Can read course materials' },
    { name: 'course:write', description: 'Can write course materials' },
    { name: 'video:watch', description: 'Can watch DRM protected videos' },
    { name: 'quiz:attempt', description: 'Can attempt quizzes' },
    { name: 'quiz:grade', description: 'Can grade quizzes' },
    { name: 'assignment:submit', description: 'Can submit assignments' },
    { name: 'assignment:grade', description: 'Can grade and give feedback on assignments' },
    { name: 'live-class:join', description: 'Can join live sessions' },
    { name: 'live-class:host', description: 'Can host live classes' },
    { name: 'billing:manage', description: 'Can manage billing and subscriptions' },
    { name: 'analytics:read', description: 'Can read learning and platform analytics' },
  ];

  const dbPermissions: Record<string, any> = {};
  for (const perm of permissionsList) {
    dbPermissions[perm.name] = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // ==========================================
  // 2. SEED ROLES
  // ==========================================
  console.log('Seeding roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Full system administrator access' },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: { name: 'TEACHER', description: 'Access to manage courses, grade assessments, and host live classes' },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: 'STUDENT' },
    update: {},
    create: { name: 'STUDENT', description: 'Access to courses, materials, quizzes, and live classrooms' },
  });

  // ==========================================
  // 3. MAP ROLE TO PERMISSIONS
  // ==========================================
  console.log('Mapping permissions to roles...');
  for (const permKey in dbPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  const teacherPerms = [
    'academic:read',
    'course:write',
    'video:watch',
    'quiz:grade',
    'assignment:grade',
    'live-class:host',
    'analytics:read',
  ];
  for (const name of teacherPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: teacherRole.id,
          permissionId: dbPermissions[name].id,
        },
      },
      update: {},
      create: {
        roleId: teacherRole.id,
        permissionId: dbPermissions[name].id,
      },
    });
  }

  const studentPerms = [
    'academic:read',
    'course:read',
    'video:watch',
    'quiz:attempt',
    'assignment:submit',
    'live-class:join',
    'analytics:read',
  ];
  for (const name of studentPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: studentRole.id,
          permissionId: dbPermissions[name].id,
        },
      },
      update: {},
      create: {
        roleId: studentRole.id,
        permissionId: dbPermissions[name].id,
      },
    });
  }

  // ==========================================
  // 4. DYNAMIC ACADEMIC HIERARCHY (TNSB ONLY)
  // ==========================================
  console.log('Seeding TNSB Academic Hierarchy...');
  
  let boardTNSB: any;
  let class12: any;
  let class9: any;
  let maths: any;
  let science: any;
  let chemistry9: any; // We map this to class 9 science subject
  
  let topicMath1: any;
  let topicMath2: any;
  let topicPhys1: any;
  let topicPhys2: any;
  let topicChem1: any;
  let topicChem2: any;
  let topicMatter1: any;
  let topicMatter2: any;

  for (const boardData of initialBoards) {
    const dbBoard = await prisma.board.upsert({
      where: { code: boardData.id.toUpperCase() },
      update: {},
      create: { name: boardData.title, code: boardData.id.toUpperCase() },
    });
    
    if (boardData.id === 'tnsb') {
      boardTNSB = dbBoard;
    }

    for (let cIndex = 0; cIndex < boardData.classes.length; cIndex++) {
      const classData = boardData.classes[cIndex];
      const sortOrder = classData.id === 'class-12' ? 12 : classData.id === 'class-11' ? 11 : classData.id === 'class-10' ? 10 : 9;
      const dbClass = await prisma.class.upsert({
        where: { boardId_name: { boardId: dbBoard.id, name: classData.title } },
        update: {},
        create: { name: classData.title, sortOrder, boardId: dbBoard.id },
      });

      if (boardData.id === 'tnsb') {
        if (classData.id === 'class-12') class12 = dbClass;
        if (classData.id === 'class-9') class9 = dbClass;
      }

      for (let sIndex = 0; sIndex < classData.subjects.length; sIndex++) {
        const subjectData = classData.subjects[sIndex];
        const dbSubject = await prisma.subject.upsert({
          where: { classId_name: { classId: dbClass.id, name: subjectData.title } },
          update: {},
          create: {
            name: subjectData.title,
            code: subjectData.id.toUpperCase(),
            sortOrder: sIndex + 1,
            classId: dbClass.id
          }
        });

        if (boardData.id === 'tnsb') {
          if (classData.id === 'class-12') {
            if (subjectData.id === 'maths-12') maths = dbSubject;
            if (subjectData.id === 'science-12') science = dbSubject;
          }
          if (classData.id === 'class-9') {
            if (subjectData.id === 'science-9') chemistry9 = dbSubject;
          }
        }

        // Create a default unit:
        const dbUnit = await prisma.unit.upsert({
          where: { subjectId_name: { subjectId: dbSubject.id, name: 'Core Syllabus' } },
          update: {},
          create: {
            name: 'Core Syllabus',
            sortOrder: 1,
            subjectId: dbSubject.id
          }
        });

        for (let chapIndex = 0; chapIndex < subjectData.chapters.length; chapIndex++) {
          const chapterData = subjectData.chapters[chapIndex];
          const dbChapter = await prisma.chapter.upsert({
            where: { unitId_name: { unitId: dbUnit.id, name: chapterData.title } },
            update: {},
            create: {
              name: chapterData.title,
              sortOrder: chapIndex + 1,
              unitId: dbUnit.id
            }
          });

          for (let topIndex = 0; topIndex < chapterData.topics.length; topIndex++) {
            const topicData = chapterData.topics[topIndex];
            const dbTopic = await prisma.topic.upsert({
              where: { chapterId_name: { chapterId: dbChapter.id, name: topicData.title } },
              update: {},
              create: {
                name: topicData.title,
                sortOrder: topIndex + 1,
                chapterId: dbChapter.id,
                requireWatchPercent: 90.0,
                requireQuizPass: true
              }
            });

            // Map standard topic variables for later courses/materials seeding
            if (boardData.id === 'tnsb') {
              if (classData.id === 'class-12') {
                if (subjectData.id === 'maths-12') {
                  if (topicData.title.includes('1.1 Adjoint')) topicMath1 = dbTopic;
                  if (topicData.title.includes('1.2 Solving')) topicMath2 = dbTopic;
                }
                if (subjectData.id === 'science-12') {
                  if (topicData.title.includes('1.1 Electrostatics')) topicPhys1 = dbTopic;
                  if (topicData.title.includes('1.2 Magnetism')) topicPhys2 = dbTopic;
                  if (topicData.title.includes('2.1 Metallurgy')) topicChem1 = dbTopic;
                  if (topicData.title.includes('2.2 Electrochemistry')) topicChem2 = dbTopic;
                }
              }
              if (classData.id === 'class-9') {
                if (subjectData.id === 'science-9') {
                  if (topicData.title.includes('2.1 Matter')) topicMatter1 = dbTopic;
                  if (topicData.title.includes('2.2 Atomic')) topicMatter2 = dbTopic;
                }
              }
            }
          }
        }
      }
    }
  }

  // Fallbacks in case titles mismatched slightly:
  if (!topicMath1) topicMath1 = await prisma.topic.findFirst({ where: { chapter: { unit: { subjectId: maths.id } } } });
  if (!topicMath2) topicMath2 = await prisma.topic.findFirst({ where: { chapter: { unit: { subjectId: maths.id } }, NOT: { id: topicMath1?.id } } });
  if (!topicPhys1) topicPhys1 = await prisma.topic.findFirst({ where: { name: { contains: 'Electrostatics' }, chapter: { unit: { subjectId: science.id } } } });
  if (!topicPhys2) topicPhys2 = await prisma.topic.findFirst({ where: { name: { contains: 'Magnetism' }, chapter: { unit: { subjectId: science.id } } } });
  if (!topicChem1) topicChem1 = await prisma.topic.findFirst({ where: { name: { contains: 'Metallurgy' }, chapter: { unit: { subjectId: science.id } } } });
  if (!topicChem2) topicChem2 = await prisma.topic.findFirst({ where: { name: { contains: 'Electrochemistry' }, chapter: { unit: { subjectId: science.id } } } });
  if (!topicMatter1) topicMatter1 = await prisma.topic.findFirst({ where: { name: { contains: 'Matter Around Us' }, chapter: { unit: { subjectId: chemistry9.id } } } });
  if (!topicMatter2) topicMatter2 = await prisma.topic.findFirst({ where: { name: { contains: 'Atomic Structure' }, chapter: { unit: { subjectId: chemistry9.id } } } });



  const chapterMatrices = await prisma.chapter.findFirst({ where: { name: { contains: 'Matrices' }, unit: { subjectId: maths.id } } });
  const chapterElectrostatics = await prisma.chapter.findFirst({ where: { name: { contains: 'Physics' }, unit: { subjectId: science.id } } });
  const chapterMetallurgy = await prisma.chapter.findFirst({ where: { name: { contains: 'Chemistry' }, unit: { subjectId: science.id } } });



  // ==========================================
  // 5. SEED USERS & ROLES
  // ==========================================
  console.log('Seeding Users...');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eduverse.com' },
    update: { passwordHash },
    create: {
      email: 'admin@eduverse.com',
      passwordHash,
      firstName: 'Aarav',
      lastName: 'Sharma',
      role: UserRole.ADMIN,
      phoneNumber: '9876543210',
    },
  });

  await prisma.admin.upsert({
    where: { id: adminUser.id },
    update: {},
    create: { id: adminUser.id, dept: 'Operations & Curriculum' },
  });

  await prisma.userRoleJoin.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  // Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@eduverse.com' },
    update: { passwordHash },
    create: {
      email: 'teacher@eduverse.com',
      passwordHash,
      firstName: 'Dr. Ramesh',
      lastName: 'Prasad',
      role: UserRole.TEACHER,
      phoneNumber: '9876543211',
    },
  });

  const dbTeacher = await prisma.teacher.upsert({
    where: { id: teacherUser.id },
    update: {},
    create: {
      id: teacherUser.id,
      bio: 'PhD in Physics from IIT Madras with 15+ years of class 9-12 teaching experience.',
      qualification: 'PhD in Physics',
    },
  });

  await prisma.userRoleJoin.upsert({
    where: { userId_roleId: { userId: teacherUser.id, roleId: teacherRole.id } },
    update: {},
    create: { userId: teacherUser.id, roleId: teacherRole.id },
  });

  // Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@eduverse.com' },
    update: { passwordHash },
    create: {
      email: 'student@eduverse.com',
      passwordHash,
      firstName: 'Prathamesh',
      lastName: 'Sharma',
      role: UserRole.STUDENT,
      phoneNumber: '9876543212',
    },
  });

  const dbStudent = await prisma.student.upsert({
    where: { id: studentUser.id },
    update: {},
    create: {
      id: studentUser.id,
      classId: class12.id,
      boardId: boardTNSB.id,
    },
  });

  await prisma.userRoleJoin.upsert({
    where: { userId_roleId: { userId: studentUser.id, roleId: studentRole.id } },
    update: {},
    create: { userId: studentUser.id, roleId: studentRole.id },
  });

  // ==========================================
  // 6. SEED SUBSCRIPTIONS
  // ==========================================
  console.log('Seeding Subscription Plans...');
  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'EduVerse Premium Monthly' },
    update: {},
    create: {
      name: 'EduVerse Premium Monthly',
      description: 'Full access to high-end live classes, premium analytics, personalized feedback, and complete syllabus.',
      price: 30000.00,
      durationDays: 30,
      billingPeriod: BillingPeriod.MONTHLY,
      isActive: true,
    },
  });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  const studentSub = await prisma.subscription.create({
    data: {
      studentId: dbStudent.id,
      planId: premiumPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: startDate,
      endDate: endDate,
      nextBillingDate: endDate,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: studentSub.id,
      amount: 30000.00,
      currency: 'INR',
      status: PaymentStatus.SUCCESS,
      gateway: PaymentGateway.RAZORPAY,
      transactionId: 'pay_HjK982Kls9PzL2',
      paidAt: startDate,
    },
  });

  // ==========================================
  // 7. SEED COURSES & CONTENT
  // ==========================================
  console.log('Seeding Courses and Materials...');

  // Maths Course
  const courseMaths = await prisma.course.create({
    data: {
      title: 'TNSB Class 12 Mathematics Masterclass',
      description: 'Comprehensive guide for Class 12 Tamil Nadu State Board Mathematics.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=300',
      subjectId: maths.id,
      classId: class12.id,
      boardId: boardTNSB.id,
      teacherId: dbTeacher.id,
    },
  });

  // Science Course
  const courseScience = await prisma.course.create({
    data: {
      title: 'TNSB Class 12 Science Masterclass',
      description: 'Comprehensive guide for Class 12 Tamil Nadu State Board Science.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      subjectId: science.id,
      classId: class12.id,
      boardId: boardTNSB.id,
      teacherId: dbTeacher.id,
    },
  });


  // Videos
  await prisma.courseVideo.create({
    data: {
      title: 'Intro to Matrices and Determinants',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=300',
      duration: 930, // 15m 30s
      topicId: topicMath1.id,
      sortOrder: 1,
    },
  });

  await prisma.courseVideo.create({
    data: {
      title: 'Coulomb\'s Law Basics',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=300',
      duration: 900,
      topicId: topicPhys1.id,
      sortOrder: 1,
    },
  });

  await prisma.courseVideo.create({
    data: {
      title: 'Alloys and Metal Properties',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=300',
      duration: 1440,
      topicId: topicChem1.id,
      sortOrder: 1,
    },
  });

  // Notes
  await prisma.courseNote.create({
    data: {
      title: 'Adjoint & Inverse Formulas Sheet',
      fileUrl: '/adjoint_inverse_rank_notes.pdf',
      topicId: topicMath1.id,
      sortOrder: 1,
      isRequiredForComplete: true,
    },
  });

  // Quizzes
  const quizMath = await prisma.quiz.create({
    data: {
      title: 'Matrices Basics Assessment',
      description: 'Test your understanding of matrices and determinants properties.',
      topicId: topicMath1.id,
      passingScore: 80.0,
      maxAttempts: 3,
      timeLimitMinutes: 10,
    },
  });

  const questionMath1 = await prisma.quizQuestion.create({
    data: {
      quizId: quizMath.id,
      questionText: 'If A is a square matrix of order 3 and |A| = 5, what is the value of |adj A|?',
      questionType: QuestionType.MCQ,
      marks: 5.0,
      sortOrder: 1,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { questionId: questionMath1.id, optionText: '5', isCorrect: false, sortOrder: 1 },
      { questionId: questionMath1.id, optionText: '25', isCorrect: true, sortOrder: 2 },
      { questionId: questionMath1.id, optionText: '125', isCorrect: false, sortOrder: 3 },
      { questionId: questionMath1.id, optionText: '1', isCorrect: false, sortOrder: 4 },
    ],
  });

  const questionMath2 = await prisma.quizQuestion.create({
    data: {
      quizId: quizMath.id,
      questionText: 'Which method is used for solving a system of linear equations using determinants?',
      questionType: QuestionType.MCQ,
      marks: 5.0,
      sortOrder: 2,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { questionId: questionMath2.id, optionText: 'Gaussian Elimination', isCorrect: false, sortOrder: 1 },
      { questionId: questionMath2.id, optionText: 'Cramer\'s Rule', isCorrect: true, sortOrder: 2 },
      { questionId: questionMath2.id, optionText: 'Matrix Inversion', isCorrect: false, sortOrder: 3 },
      { questionId: questionMath2.id, optionText: 'Euler\'s Method', isCorrect: false, sortOrder: 4 },
    ],
  });

  // Assignments
  await prisma.assignment.create({
    data: {
      title: 'Solving Systems of Linear Equations by Cramer\'s Rule',
      description: 'Solve the systems of equations using Cramer\'s rule, Matrix inversion method, and Gaussian elimination. Show step-by-step calculations and submit a PDF file.',
      fileUrl: '/cramer_proof.pdf',
      topicId: topicMath2.id,
      maxMarks: 100.0,
      passingMarks: 40.0,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  // ==========================================
  // 8. SEED INITIAL PROGRESS
  // ==========================================
  console.log('Seeding initial student progress...');
  
  // Mathematics progress
  await prisma.studentSubjectProgress.create({
    data: { studentId: dbStudent.id, subjectId: maths.id, isCompleted: false, completedPercentage: 0.0, unlocked: true },
  });
  await prisma.studentChapterProgress.create({
    data: { studentId: dbStudent.id, chapterId: chapterMatrices.id, isCompleted: false, completedPercentage: 0.0, unlocked: true },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicMath1.id, unlocked: true, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicMath2.id, unlocked: false, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });

  // Science progress
  await prisma.studentSubjectProgress.create({
    data: { studentId: dbStudent.id, subjectId: science.id, isCompleted: false, completedPercentage: 0.0, unlocked: true },
  });
  await prisma.studentChapterProgress.create({
    data: { studentId: dbStudent.id, chapterId: chapterElectrostatics.id, isCompleted: false, completedPercentage: 0.0, unlocked: true },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicPhys1.id, unlocked: true, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicPhys2.id, unlocked: false, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });

  await prisma.studentChapterProgress.create({
    data: { studentId: dbStudent.id, chapterId: chapterMetallurgy.id, isCompleted: false, completedPercentage: 0.0, unlocked: true },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicChem1.id, unlocked: true, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });
  await prisma.studentTopicProgress.create({
    data: { studentId: dbStudent.id, topicId: topicChem2.id, unlocked: false, isCompleted: false, watchPercent: 0.0, quizCompleted: false, assignmentCompleted: false, notesViewed: false },
  });


  // ==========================================
  // 9. SEED ANALYTICS & GAMIFICATION
  // ==========================================
  console.log('Seeding student analytics structures...');
  await prisma.studentAnalytics.create({
    data: {
      studentId: dbStudent.id,
      totalStudyTimeMinutes: 45,
      averageQuizScore: 90.0,
      overallCompletionRate: 15.0,
      xp: 2100,
    },
  });

  await prisma.learningStreak.create({
    data: {
      studentId: dbStudent.id,
      currentStreak: 9,
      longestStreak: 12,
      lastActivityDate: new Date(),
    },
  });

  await prisma.subjectStatistics.create({
    data: {
      studentId: dbStudent.id,
      subjectId: maths.id,
      topicsCompleted: 0,
      totalTopics: 2,
      quizzesTaken: 0,
      quizzesPassed: 0,
      averageScore: 0.0,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
