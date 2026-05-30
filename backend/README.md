# CampusSkill Hub — Backend

Training and student progress management API built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + Passport (RBAC)
- **Validation:** Zod
- **Real-time:** Socket.IO
- **Storage:** Multer (local / cloud)
- **Email:** Nodemailer + Handlebars
- **Docs:** Swagger / OpenAPI 3.0

## Architecture

Clean Architecture with 4 layers:

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Domain** | `src/domain/` | Entities, repository interfaces, value objects |
| **Application** | `src/application/` | Use cases, DTOs, validation schemas |
| **Infrastructure** | `src/infrastructure/` | Prisma repos, JWT, email, storage, audit |
| **Presentation** | `src/presentation/` | Controllers, routes, middleware, validators |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy env and edit database credentials
cp .env .env.local

# Generate Prisma client and sync schema
npx prisma generate
npx prisma db push

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_EXPIRES_IN` | Access token expiry | 1d |
| `SMTP_HOST` | Email server host | smtp.gmail.com |
| `SMTP_PORT` | Email server port | 587 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## API Endpoints

All endpoints are documented via Swagger at `http://localhost:5000/api-docs`.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/refresh-token` | Refresh JWT |

### Core Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | `/api/colleges` | College management |
| CRUD | `/api/courses` | Course management |
| CRUD | `/api/enrollments` | Student enrollments |
| CRUD | `/api/attendance` | Attendance tracking |
| CRUD | `/api/assignments` | Assignment management |
| CRUD | `/api/assessments` | MCQ & coding tests |
| CRUD | `/api/projects` | Project management |
| CRUD | `/api/certificates` | Certificate generation |
| CRUD | `/api/reports` | Export reports (PDF/Excel) |
| GET | `/api/analytics` | Dashboard analytics |

## Database Schema

22 models: User, College, CollegeAdmin, Trainer, Student, Course, Module, Lesson, Enrollment, StudyMaterial, RecordedVideo, LiveClass, Assignment, AssignmentSubmission, MCQTest, MCQQuestion, MCQOption, MCQAttempt, MCQAnswer, CodingAssessment, CodingSubmission, Attendance, Project, ProjectMilestone, MentorFeedback, Certificate, Subscription, Notification, AuditLog.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run prisma:seed` | Seed database |
| `npm run prisma:migrate` | Run migrations |
| `npm test` | Run tests |
