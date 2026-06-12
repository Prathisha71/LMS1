# LMS Project Refactoring Guide

## Overview
The LMS project has been refactored to align with the Prisma database schema and follow clean architecture principles.

## Key Changes

### 1. Database Integration
- **Location**: `/prisma/schema.prisma`
- Added Prisma ORM for type-safe database operations
- PostgreSQL database configured
- 20+ models covering users, courses, quizzes, assignments, and analytics

### 2. Store Management Refactor
- **Old**: `src/store/useLmsStore.ts` (2455 lines with hard-coded data)
- **New**: 
  - `src/store/types.ts`: Database-aligned TypeScript types
  - `src/store/index.ts`: Clean, minimal Zustand store (80 lines)

### 3. API Service Layer
- **Location**: `src/services/api.ts`
- Organized by domain (auth, academic, course, quiz, assignment, progress)
- All endpoints typed and documented
- Authentication token handling built-in

### 4. Component Structure
Essential components:
- `Header.tsx` - Navigation header
- `Sidebar.tsx` - Side navigation
- `LandingPage.tsx` - Public landing page
- `LoginPage.tsx` / `SignupPage.tsx` - Authentication
- `StudentDashboard.tsx` - Main student view
- `CourseLearningPage.tsx` - Video lessons (Deep Lectures)
- `QuizInterface.tsx` - Quiz taker (Quiz Center)
- `AssignmentPage.tsx` - Assignment management
- `StudentProfile.tsx` - Profile management
- `TeacherDashboard.tsx` - Teacher portal
- `AdminPortal.tsx` - Admin controls

Removed/Simplified:
- `DemoConsole.tsx` → Consolidate with other features
- `AdvancedFeatures.tsx` → Split into specific features
- Hard-coded quiz data in `quizGenerator.ts` → Use API instead

## Environment Variables
Create `.env` file (use `.env.example` as template):
```
DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
VITE_API_URL="http://localhost:3000"
```

## Database Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Data Models Summary

### User Management
- **Users**: Core user accounts with roles (ADMIN, TEACHER, STUDENT)
- **Admin/Teacher/Student**: Role-specific profiles
- **Roles & Permissions**: RBAC system

### Academic Structure
- **Boards**: Education boards (CBSE, ICSE, etc.)
- **Classes**: Class levels (1-12)
- **Subjects**: Subjects within classes
- **Units**: Organizational grouping
- **Chapters**: Chapter within units
- **Topics**: Learning units with completion requirements

### Content Delivery
- **CourseVideos**: DRM-protected video content
- **CourseNotes**: PDF and document notes
- **CourseResources**: Additional learning materials

### Assessment
- **Quizzes**: Quiz definitions with settings
- **QuizQuestions**: Questions with MCQ/MSQ/TF/Comprehension types
- **QuizOptions**: Answer options
- **QuizAttempts**: Student attempt records
- **Assignments**: Assignment definitions
- **AssignmentSubmissions**: Student submissions

### Progress Tracking
- **StudentTopicProgress**: Topic completion status
- **StudentChapterProgress**: Chapter completion
- **StudentSubjectProgress**: Subject-level progress
- **VideoWatchHistory**: Video viewing history
- **StudentAnalytics**: Aggregated learning analytics
- **LearningStreak**: Gamification tracking

### Live Classes
- **LiveClass**: Scheduled live sessions
- **LiveClassParticipant**: Attendance tracking
- **LiveChatMessage**: Chat during sessions

### Billing & Subscriptions
- **SubscriptionPlan**: Available plans
- **Subscription**: Student subscriptions
- **Payment**: Payment records

## Architecture Pattern
```
src/
├── components/          # React components
├── services/           # API service layer
├── store/              # State management (Zustand)
├── utils/              # Helper functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Next Steps
1. Implement backend API endpoints using the Prisma schema
2. Connect frontend services to backend APIs
3. Implement authentication flow
4. Test database migrations
5. Set up payment processing
6. Implement DRM for video protection
7. Add WebSocket for live classes

## Dependencies Added
- `@prisma/client` - Type-safe database client
- `prisma` - Prisma ORM (dev dependency)

## Type Safety
All API calls are fully typed using the schema types. The store is typed with Zustand + TypeScript generics for complete type safety across the application.
