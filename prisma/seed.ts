import { PrismaClient, UserRole, QuestionType, LiveClassStatus, AttendanceStatus, NotificationType, BillingPeriod, SubscriptionStatus, PaymentStatus, PaymentGateway, SubmissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

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
  // Admin permissions (All)
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

  // Teacher permissions
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

  // Student permissions
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
  // 4. DYNAMIC ACADEMIC HIERARCHY
  // ==========================================
  console.log('Seeding Academic Hierarchy...');
  
  // Board
  const boardCBSE = await prisma.board.upsert({
    where: { code: 'CBSE' },
    update: {},
    create: { name: 'Central Board of Secondary Education', code: 'CBSE' },
  });

  // Class
  const class10 = await prisma.class.upsert({
    where: { boardId_name: { boardId: boardCBSE.id, name: 'Class 10' } },
    update: {},
    create: { name: 'Class 10', sortOrder: 10, boardId: boardCBSE.id },
  });

  // Subject
  const physics = await prisma.subject.upsert({
    where: { classId_name: { classId: class10.id, name: 'Physics' } },
    update: {},
    create: { name: 'Physics', code: 'PHY10', sortOrder: 1, classId: class10.id },
  });

  // Unit
  const unitOptics = await prisma.unit.upsert({
    where: { subjectId_name: { subjectId: physics.id, name: 'Light & Optics' } },
    update: {},
    create: { name: 'Light & Optics', sortOrder: 1, subjectId: physics.id },
  });

  // Chapter
  const chapterReflection = await prisma.chapter.upsert({
    where: { unitId_name: { unitId: unitOptics.id, name: 'Reflection of Light' } },
    update: {},
    create: { name: 'Reflection of Light', sortOrder: 1, unitId: unitOptics.id },
  });

  // Topics (Sequential)
  const topic1 = await prisma.topic.upsert({
    where: { chapterId_name: { chapterId: chapterReflection.id, name: 'Introduction to Reflection & Mirrors' } },
    update: {},
    create: {
      name: 'Introduction to Reflection & Mirrors',
      sortOrder: 1,
      chapterId: chapterReflection.id,
      requireWatchPercent: 90.0,
      requireQuizPass: true,
      requireAssignSubmit: false,
      requireNotesViewed: false,
    },
  });

  const topic2 = await prisma.topic.upsert({
    where: { chapterId_name: { chapterId: chapterReflection.id, name: 'Spherical Mirrors & Ray Diagrams' } },
    update: {},
    create: {
      name: 'Spherical Mirrors & Ray Diagrams',
      sortOrder: 2,
      chapterId: chapterReflection.id,
      prerequisiteTopicId: topic1.id,
      requireWatchPercent: 90.0,
      requireQuizPass: true,
      requireAssignSubmit: false,
      requireNotesViewed: false,
    },
  });

  const topic3 = await prisma.topic.upsert({
    where: { chapterId_name: { chapterId: chapterReflection.id, name: 'Mirror Formula & Magnification' } },
    update: {},
    create: {
      name: 'Mirror Formula & Magnification',
      sortOrder: 3,
      chapterId: chapterReflection.id,
      prerequisiteTopicId: topic2.id,
      requireWatchPercent: 90.0,
      requireQuizPass: true,
      requireAssignSubmit: true,
      requireNotesViewed: true,
    },
  });

  // ==========================================
  // 5. SEED USERS & ROLES
  // ==========================================
  console.log('Seeding Users...');
  
  // Hash passwords (normally bcrypt, but using placeholder hash for seeding simplicity)
  const adminPass = '$2b$10$xyz1234567890abcdefghijklmnopqrstubvwxyz';
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eduverse.com' },
    update: {},
    create: {
      email: 'admin@eduverse.com',
      passwordHash: adminPass,
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
    update: {},
    create: {
      email: 'teacher@eduverse.com',
      passwordHash: adminPass,
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
    update: {},
    create: {
      email: 'student@eduverse.com',
      passwordHash: adminPass,
      firstName: 'Rohan',
      lastName: 'Verma',
      role: UserRole.STUDENT,
      phoneNumber: '9876543212',
    },
  });

  const dbStudent = await prisma.student.upsert({
    where: { id: studentUser.id },
    update: {},
    create: {
      id: studentUser.id,
      classId: class10.id,
      boardId: boardCBSE.id,
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
  const coursePhysics = await prisma.course.create({
    data: {
      title: 'CBSE Class 10 Physics Masterclass',
      description: 'Comprehensive high-scoring masterclass for Class 10 CBSE Board Physics.',
      thumbnailUrl: 'https://images.eduverse.com/courses/cbse10_phy.jpg',
      subjectId: physics.id,
      classId: class10.id,
      boardId: boardCBSE.id,
      teacherId: dbTeacher.id,
    },
  });

  // Topic 1 Content
  const video1 = await prisma.courseVideo.create({
    data: {
      title: 'Intro to Light Reflection & Law of Reflection',
      videoUrl: 'https://streaming.eduverse.com/physics/10/reflection_intro.mpd',
      thumbnailUrl: 'https://images.eduverse.com/thumbnails/reflection_intro.jpg',
      duration: 720, // 12 minutes
      drmMetadata: {
        keyId: 'cbse10-phy-ref-001',
        provider: 'VdoCipher',
        token: 'vdo_token_reflection_intro_abc123',
      },
      topicId: topic1.id,
      sortOrder: 1,
    },
  });

  const note1 = await prisma.courseNote.create({
    data: {
      title: 'Reflection Laws & Plane Mirror Characteristics',
      fileUrl: 'https://storage.eduverse.com/notes/class10/physics/reflection_laws.pdf',
      topicId: topic1.id,
      sortOrder: 1,
      isRequiredForComplete: true,
    },
  });

  // Topic 1 Quiz
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Laws of Reflection & Mirrors Basics Quiz',
      description: 'Test your understanding of reflection rules and basic properties of mirrors.',
      topicId: topic1.id,
      passingScore: 80.0, // 80% passing criteria
      maxAttempts: 3,
      timeLimitMinutes: 15,
    },
  });

  const question1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'According to the Laws of Reflection, which of the following is correct?',
      questionType: QuestionType.MCQ,
      marks: 4.0,
      sortOrder: 1,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { questionId: question1.id, optionText: 'Angle of incidence is equal to angle of reflection (i = r)', isCorrect: true, sortOrder: 1 },
      { questionId: question1.id, optionText: 'Angle of incidence is double the angle of reflection (i = 2r)', isCorrect: false, sortOrder: 2 },
      { questionId: question1.id, optionText: 'Angle of incidence is half of angle of reflection (2i = r)', isCorrect: false, sortOrder: 3 },
      { questionId: question1.id, optionText: 'There is no relationship between angle of incidence and angle of reflection', isCorrect: false, sortOrder: 4 },
    ],
  });

  const question2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'An image formed by a plane mirror is always:',
      questionType: QuestionType.MCQ,
      marks: 4.0,
      sortOrder: 2,
    },
  });

  await prisma.quizOption.createMany({
    data: [
      { questionId: question2.id, optionText: 'Real and Inverted', isCorrect: false, sortOrder: 1 },
      { questionId: question2.id, optionText: 'Virtual and Erect', isCorrect: true, sortOrder: 2 },
      { questionId: question2.id, optionText: 'Real and Erect', isCorrect: false, sortOrder: 3 },
      { questionId: question2.id, optionText: 'Virtual and Inverted', isCorrect: false, sortOrder: 4 },
    ],
  });

  // Topic 3 Assignment
  const assignment3 = await prisma.assignment.create({
    data: {
      title: 'Mirror Formula & Magnification Problem Set',
      description: 'Solve the 5 problems on mirror formula (1/f = 1/v + 1/u) and magnification (m = -v/u) in the attached sheet. Show all working steps.',
      fileUrl: 'https://storage.eduverse.com/assignments/class10/physics/mirror_problems.pdf',
      topicId: topic3.id,
      maxMarks: 50.0,
      passingMarks: 20.0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  // ==========================================
  // 8. SEED INITIAL PROGRESS (STUDENT TOPIC 1 UNLOCKED)
  // ==========================================
  console.log('Seeding initial student progress...');
  
  // Subject level progress
  await prisma.studentSubjectProgress.create({
    data: {
      studentId: dbStudent.id,
      subjectId: physics.id,
      isCompleted: false,
      completedPercentage: 0.0,
      unlocked: true,
    },
  });

  // Chapter level progress
  await prisma.studentChapterProgress.create({
    data: {
      studentId: dbStudent.id,
      chapterId: chapterReflection.id,
      isCompleted: false,
      completedPercentage: 0.0,
      unlocked: true,
    },
  });

  // Topic 1 progress (unlocked since it has no prerequisite)
  await prisma.studentTopicProgress.create({
    data: {
      studentId: dbStudent.id,
      topicId: topic1.id,
      unlocked: true,
      isCompleted: false,
      watchPercent: 0.0,
      quizCompleted: false,
      assignmentCompleted: false,
      notesViewed: false,
    },
  });

  // Topic 2 progress (locked since Topic 1 is not completed)
  await prisma.studentTopicProgress.create({
    data: {
      studentId: dbStudent.id,
      topicId: topic2.id,
      unlocked: false,
      isCompleted: false,
      watchPercent: 0.0,
      quizCompleted: false,
      assignmentCompleted: false,
      notesViewed: false,
    },
  });

  // Topic 3 progress (locked)
  await prisma.studentTopicProgress.create({
    data: {
      studentId: dbStudent.id,
      topicId: topic3.id,
      unlocked: false,
      isCompleted: false,
      watchPercent: 0.0,
      quizCompleted: false,
      assignmentCompleted: false,
      notesViewed: false,
    },
  });

  // ==========================================
  // 9. SEED ANALYTICS & GAMIFICATION
  // ==========================================
  console.log('Seeding student analytics structures...');
  await prisma.studentAnalytics.create({
    data: {
      studentId: dbStudent.id,
      totalStudyTimeMinutes: 0,
      averageQuizScore: 0.0,
      overallCompletionRate: 0.0,
      xp: 100, // starting xp
    },
  });

  await prisma.learningStreak.create({
    data: {
      studentId: dbStudent.id,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: new Date(),
    },
  });

  await prisma.subjectStatistics.create({
    data: {
      studentId: dbStudent.id,
      subjectId: physics.id,
      topicsCompleted: 0,
      totalTopics: 3,
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
