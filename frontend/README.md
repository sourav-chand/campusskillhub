# CampusSkill Hub — Frontend

Modern learning management dashboard built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (Radix primitives)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** react-hook-form + Zod
- **State:** Jotai
- **HTTP:** Axios
- **Table:** @tanstack/react-table
- **Theme:** next-themes (dark mode)
- **Notifications:** react-hot-toast

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/               # Login, register, forgot/reset password
│   ├── dashboard/            # Role-specific dashboards
│   │   ├── super-admin/
│   │   ├── college-admin/
│   │   ├── trainer/
│   │   └── student/
│   ├── courses/              # Course listing & detail
│   ├── attendance/           # Attendance management
│   ├── assessments/          # MCQ & coding tests
│   ├── projects/             # Project management
│   ├── certificates/         # Certificate viewer
│   ├── reports/              # Report generation
│   ├── notifications/        # In-app notifications
│   └── settings/             # User settings
├── components/
│   ├── ui/                   # shadcn/ui primitives (26 components)
│   ├── layout/               # Sidebar, header, dashboard/auth shells
│   ├── forms/                # Form components
│   ├── tables/               # Data table components
│   ├── charts/               # Recharts wrapper components
│   └── shared/               # Reusable: DataTable, Pagination, FileUpload, etc.
├── hooks/                    # Custom hooks (useAuth, useApi, useDebounce, usePagination)
├── lib/                      # Utilities (cn, axios instance, auth helpers)
├── services/                 # API service modules (11 services)
├── store/                    # Jotai atoms
└── types/                    # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:5000/api |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | http://localhost:3000 |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL | http://localhost:5000 |

## Features

### By Role

| Feature | Super Admin | College Admin | Trainer | Student |
|---------|:-----------:|:-------------:|:-------:|:-------:|
| Dashboard analytics | ✅ | ✅ | ✅ | ✅ |
| College management | ✅ | - | - | - |
| Course management | ✅ | ✅ | ✅ | - |
| Student management | ✅ | ✅ | - | - |
| Trainer management | ✅ | ✅ | - | - |
| Attendance tracking | ✅ | ✅ | ✅ | ✅ |
| Assessments (MCQ/Coding) | ✅ | ✅ | ✅ | ✅ |
| Project management | ✅ | ✅ | ✅ | ✅ |
| Certificates | ✅ | ✅ | ✅ | ✅ |
| Reports (PDF/Excel) | ✅ | ✅ | ✅ | ✅ |
| Subscription management | ✅ | ✅ | - | - |
| Live classes | - | ✅ | ✅ | ✅ |

### Dark Mode
Toggle between light, dark, and system themes from settings or the header.

## Available Pages

| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/dashboard/super-admin` | Super Admin dashboard |
| `/dashboard/college-admin` | College Admin dashboard |
| `/dashboard/trainer` | Trainer dashboard |
| `/dashboard/student` | Student dashboard |
| `/courses` | Course listing |
| `/courses/[id]` | Course detail |
| `/attendance` | Attendance tracking |
| `/assessments` | Assessments list |
| `/assessments/[id]` | Take assessment |
| `/projects` | Project management |
| `/certificates` | Certificates |
| `/reports` | Reports |
| `/notifications` | Notifications |
| `/settings` | User settings |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
