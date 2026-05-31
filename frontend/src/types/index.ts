// ===================== User & Auth =====================
export type UserRole = 'super_admin' | 'admin' | 'instructor' | 'student' | 'mentor';

export interface User {
  _id: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  college?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===================== College =====================
export interface College {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===================== Course =====================
export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  college: string;
  instructor: string | User;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  syllabus?: string;
  isPublished: boolean;
  totalModules: number;
  totalLessons: number;
  enrolledCount: number;
  rating: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  createdAt: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isFree: boolean;
  resources: LessonResource[];
  createdAt: string;
}

export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link' | 'file';
}

// ===================== Enrollment =====================
export interface Enrollment {
  _id: string;
  student: string | User;
  course: string | Course;
  progress: number;
  completedLessons: string[];
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
}

// ===================== Attendance =====================
export interface Attendance {
  _id: string;
  student: string | User;
  course: string | Course;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string | User;
  remarks?: string;
  createdAt: string;
}

// ===================== Assignment =====================
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  module?: string;
  dueDate: string;
  maxScore: number;
  passingScore: number;
  attachments: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  _id: string;
  assignment: string | Assignment;
  student: string | User;
  content?: string;
  attachments: string[];
  submittedAt: string;
  score?: number;
  feedback?: string;
  gradedBy?: string | User;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'resubmitted';
}

// ===================== MCQ / Quiz =====================
export interface MCQTest {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  module?: string;
  duration: number;
  passingScore: number;
  maxScore: number;
  questions: MCQQuestion[];
  isPublished: boolean;
  shuffleQuestions: boolean;
  attemptsAllowed: number;
  createdAt: string;
}

export interface MCQQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  marks: number;
}

export interface MCQAttempt {
  _id: string;
  test: string | MCQTest;
  student: string | User;
  answers: number[];
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeTaken: number;
}

// ===================== Coding Assessment =====================
export interface CodingAssessment {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  module?: string;
  language: string;
  problemStatement: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCases: TestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  isPublished: boolean;
  createdAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

export interface CodingSubmission {
  _id: string;
  assessment: string | CodingAssessment;
  student: string | User;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  testResults: TestResult[];
  score: number;
  submittedAt: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

// ===================== Project =====================
export interface Project {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  students: (string | User)[];
  mentor?: string | User;
  milestones: ProjectMilestone[];
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  githubUrl?: string;
  demoUrl?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface ProjectMilestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed';
  feedback?: MentorFeedback[];
}

export interface MentorFeedback {
  _id: string;
  mentor: string | User;
  milestone?: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// ===================== Certificate =====================
export interface Certificate {
  _id: string;
  student: string | User;
  course: string | Course;
  certificateId: string;
  issuedAt: string;
  expiresAt?: string;
  grade: string;
  totalScore: number;
  downloadUrl: string;
}

// ===================== Subscription =====================
export interface Subscription {
  _id: string;
  college: string | College;
  plan: 'basic' | 'premium' | 'enterprise';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
  features: string[];
  createdAt: string;
}

// ===================== Notification =====================
export interface Notification {
  _id: string;
  recipient: string | User;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ===================== Audit Log =====================
export interface AuditLog {
  _id: string;
  user: string | User;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

// ===================== API Response Types =====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ===================== Dashboard =====================
export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completionRate: number;
  averageRating: number;
  revenue?: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  date: string;
  value: number;
  label?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  label: string;
  value: number;
  secondaryValue?: number;
}
