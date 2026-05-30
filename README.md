# CampusSkill Hub

**Training and Student Progress Management Platform**

CampusSkill Hub is a comprehensive platform designed to manage college-level training programs, track student progress, conduct assessments, and manage certifications. Built with a modern tech stack, it supports multiple user roles including Super Admin, College Admin, Trainers, and Students.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT + Passport
- **Validation:** Zod
- **Real-time:** Socket.IO
- **API Documentation:** Swagger/OpenAPI
- **File Upload:** Multer
- **Email:** Nodemailer
- **PDF Generation:** PDFKit
- **Excel Processing:** ExcelJS

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **State Management:** Jotai
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Tables:** TanStack Table
- **HTTP Client:** Axios
- **Authentication:** NextAuth.js

### Infrastructure
- **Containerization:** Docker
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Registry:** GitHub Container Registry

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 9.x
- **PostgreSQL** >= 16
- **Docker** & **Docker Compose** (for containerized deployment)

---

## Installation

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/campusskill_hub
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Local Setup

#### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The backend will start on `http://localhost:5000` and the frontend on `http://localhost:3000`.

### Seed Database

```bash
cd backend
npm run prisma:seed
```

---

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker compose build
docker compose up -d
```

This starts three services:
- **PostgreSQL** on port `5432`
- **Backend** on port `5000`
- **Frontend** on port `3000`

### Production Deployment with Nginx

The included `nginx.conf` configures a reverse proxy for production use with:
- SSL support preparation
- WebSocket proxying for Socket.IO
- Static asset caching
- Gzip compression
- Security headers

---

## API Documentation

When running, Swagger API documentation is available at:
```
http://localhost:5000/api-docs
```

### Core API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |

#### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (admin) |
| GET | `/api/users/:id` | Get user details |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

#### Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges |
| POST | `/api/colleges` | Create college |
| GET | `/api/colleges/:id` | Get college details |
| PUT | `/api/colleges/:id` | Update college |
| PATCH | `/api/colleges/:id/status` | Update college status |

#### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses |
| POST | `/api/courses` | Create course |
| GET | `/api/courses/:id` | Get course with modules/lessons |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

#### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | List enrollments |
| POST | `/api/enrollments` | Enroll student |
| PUT | `/api/enrollments/:id` | Update enrollment progress |

#### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | List MCQ tests |
| POST | `/api/tests` | Create MCQ test |
| POST | `/api/tests/:id/attempt` | Submit MCQ attempt |
| GET | `/api/coding-assessments` | List coding assessments |
| POST | `/api/coding-assessments` | Create coding assessment |
| POST | `/api/coding-assessments/:id/submit` | Submit coding solution |

#### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | List assignments |
| POST | `/api/assignments` | Create assignment |
| POST | `/api/assignments/:id/submit` | Submit assignment |
| PUT | `/api/assignments/submissions/:id/grade` | Grade submission |

#### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List attendance records |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance/student/:id` | Get student attendance |

#### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| POST | `/api/projects/:id/milestones` | Add milestone |

#### Certificates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certificates` | List certificates |
| POST | `/api/certificates` | Generate certificate |
| GET | `/api/certificates/verify/:id` | Verify certificate |

#### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List user notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## Project Structure

```
campusskill-hub/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Seed data script
│   ├── src/
│   │   ├── application/           # Use cases / business logic
│   │   ├── config/                # App configuration
│   │   ├── domain/                # Domain models & interfaces
│   │   ├── infrastructure/        # External services, DB, email
│   │   ├── presentation/          # Controllers, routes, middleware
│   │   ├── shared/                # Shared utilities, types
│   │   └── server.ts              # Entry point
│   ├── tests/                     # Test files
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # Shared UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utility functions
│   │   ├── services/              # API client services
│   │   ├── store/                 # Jotai state stores
│   │   └── types/                 # TypeScript type definitions
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI pipeline
│       └── deploy.yml             # Deploy pipeline
├── docker-compose.yml             # Docker Compose config
├── nginx.conf                     # Nginx production config
└── README.md
```

---

## User Roles and Features

### Super Admin
- Manage all colleges (approve/reject/suspend)
- View system-wide analytics and reports
- Manage admin users
- Configure system settings

### College Admin
- Manage college profile and settings
- Add/manage trainers
- View college-wide student progress
- Generate reports for their college
- Manage subscriptions

### Trainer
- Create and manage courses, modules, and lessons
- Conduct live classes
- Create assignments and assessments
- Grade submissions
- Track student progress
- Record attendance

### Student
- Browse and enroll in courses
- Access study materials and recorded videos
- Attend live classes
- Submit assignments and assessments
- Work on projects with milestones
- View progress and grades
- Download certificates

---

## Screenshots

*Screenshots coming soon.*

---

## License

This project is proprietary software.
