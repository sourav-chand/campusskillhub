import { container } from '@config/container';
import { JWT } from '@infrastructure/auth/jwt';
import bcrypt from 'bcryptjs';

import { RegisterUseCase } from '@application/usecases/auth/register.usecase';
import { LoginUseCase } from '@application/usecases/auth/login.usecase';
import { ForgotPasswordUseCase } from '@application/usecases/auth/forgot-password.usecase';
import { ResetPasswordUseCase } from '@application/usecases/auth/reset-password.usecase';
import { VerifyEmailUseCase } from '@application/usecases/auth/verify-email.usecase';
import { RefreshTokenUseCase } from '@application/usecases/auth/refresh-token.usecase';
import { LogoutUseCase } from '@application/usecases/auth/logout.usecase';

import { CreateCollegeUseCase } from '@application/usecases/college/create-college.usecase';
import { UpdateCollegeUseCase } from '@application/usecases/college/update-college.usecase';
import { ApproveCollegeUseCase } from '@application/usecases/college/approve-college.usecase';
import { GetCollegeUseCase } from '@application/usecases/college/get-college.usecase';
import { ListCollegesUseCase } from '@application/usecases/college/list-colleges.usecase';

import { CreateCourseUseCase } from '@application/usecases/course/create-course.usecase';
import { UpdateCourseUseCase } from '@application/usecases/course/update-course.usecase';
import { GetCourseUseCase } from '@application/usecases/course/get-course.usecase';
import { ListCoursesUseCase } from '@application/usecases/course/list-courses.usecase';
import { PublishCourseUseCase } from '@application/usecases/course/publish-course.usecase';

import { CreateEnrollmentUseCase } from '@application/usecases/enrollment/create-enrollment.usecase';
import { GetEnrollmentsUseCase } from '@application/usecases/enrollment/get-enrollments.usecase';
import { UpdateProgressUseCase } from '@application/usecases/enrollment/update-progress.usecase';

import { MarkAttendanceUseCase } from '@application/usecases/attendance/mark-attendance.usecase';
import { GetAttendanceUseCase } from '@application/usecases/attendance/get-attendance.usecase';
import { GetMonthlyReportUseCase } from '@application/usecases/attendance/get-monthly-report.usecase';

import { CreateAssignmentUseCase } from '@application/usecases/assignment/create-assignment.usecase';
import { SubmitAssignmentUseCase } from '@application/usecases/assignment/submit-assignment.usecase';
import { GradeAssignmentUseCase } from '@application/usecases/assignment/grade-assignment.usecase';
import { ListAssignmentsUseCase } from '@application/usecases/assignment/list-assignments.usecase';

import { CreateMCQUseCase } from '@application/usecases/assessment/create-mcq.usecase';
import { CreateCodingUseCase } from '@application/usecases/assessment/create-coding.usecase';
import { SubmitMCQUseCase } from '@application/usecases/assessment/submit-mcq.usecase';
import { SubmitCodingUseCase } from '@application/usecases/assessment/submit-coding.usecase';
import { GetResultsUseCase } from '@application/usecases/assessment/get-results.usecase';
import { GetLeaderboardUseCase } from '@application/usecases/assessment/get-leaderboard.usecase';

import { CreateProjectUseCase } from '@application/usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '@application/usecases/project/update-project.usecase';
import { AddMilestoneUseCase } from '@application/usecases/project/add-milestone.usecase';
import { AddFeedbackUseCase } from '@application/usecases/project/add-feedback.usecase';
import { GetProjectsUseCase } from '@application/usecases/project/get-projects.usecase';

import { GenerateCertificateUseCase } from '@application/usecases/certificate/generate-certificate.usecase';
import { VerifyCertificateUseCase } from '@application/usecases/certificate/verify-certificate.usecase';
import { GetCertificatesUseCase } from '@application/usecases/certificate/get-certificates.usecase';

import { CreateSubscriptionUseCase } from '@application/usecases/subscription/create-subscription.usecase';
import { GetSubscriptionsUseCase } from '@application/usecases/subscription/get-subscriptions.usecase';

import { GetNotificationsUseCase } from '@application/usecases/notification/get-notifications.usecase';
import { MarkReadUseCase } from '@application/usecases/notification/mark-read.usecase';

import { GetDashboardStatsUseCase } from '@application/usecases/analytics/get-dashboard-stats.usecase';
import { GetStudentGrowthUseCase } from '@application/usecases/analytics/get-student-growth.usecase';
import { GetCourseAnalyticsUseCase } from '@application/usecases/analytics/get-course-analytics.usecase';
import { GetCollegeAnalyticsUseCase } from '@application/usecases/analytics/get-college-analytics.usecase';

import { AuthController } from './AuthController';
import { CollegeController } from './CollegeController';
import { CourseController } from './CourseController';
import { EnrollmentController } from './EnrollmentController';
import { AttendanceController } from './AttendanceController';
import { AssignmentController } from './AssignmentController';
import { AssessmentController } from './AssessmentController';
import { ProjectController } from './ProjectController';
import { CertificateController } from './CertificateController';
import { SubscriptionController } from './SubscriptionController';
import { NotificationController } from './NotificationController';
import { AnalyticsController } from './AnalyticsController';
import { ReportController } from './ReportController';
import { UserController } from './UserController';

const passwordHasher = {
  hash: (password: string) => bcrypt.hash(password, 12),
  compare: (password: string, hash: string) => bcrypt.compare(password, hash),
};

const tokenService = {
  generateTokens: async (payload: { userId: string; email: string; role: string; collegeId?: string }) => ({
    accessToken: JWT.generateAccessToken(payload),
    refreshToken: JWT.generateRefreshToken(payload),
    expiresIn: 900,
  }),
  verifyRefreshToken: async (token: string) => JWT.verifyRefreshToken(token),
};

const tokenStore = new Map<string, { userId: string; expiresAt: Date }>();
const refreshTokenRepo = {
  findToken: async (token: string) => tokenStore.get(token) || null,
  save: async (userId: string, token: string, expiresAt: Date) => {
    tokenStore.set(token, { userId, expiresAt });
  },
  deleteToken: async (token: string) => {
    tokenStore.delete(token);
  },
  deleteAllUserTokens: async (userId: string) => {
    for (const [key, value] of tokenStore.entries()) {
      if (value.userId === userId) tokenStore.delete(key);
    }
  },
};

const { repositories, services } = container;

export const authController = new AuthController(
  new RegisterUseCase(repositories.userRepository as never, services.emailService as never, passwordHasher as never),
  new LoginUseCase(repositories.userRepository as never, passwordHasher as never, tokenService, refreshTokenRepo),
  new ForgotPasswordUseCase(repositories.userRepository as never, services.emailService as never),
  new ResetPasswordUseCase(repositories.userRepository as never, passwordHasher as never),
  new VerifyEmailUseCase(repositories.userRepository as never),
  new RefreshTokenUseCase(tokenService, refreshTokenRepo),
  new LogoutUseCase(refreshTokenRepo),
);

export const collegeController = new CollegeController(
  new CreateCollegeUseCase(repositories.collegeRepository as never, repositories.userRepository as never, passwordHasher as never),
  new UpdateCollegeUseCase(repositories.collegeRepository as never),
  new ApproveCollegeUseCase(repositories.collegeRepository as never),
  new GetCollegeUseCase(repositories.collegeRepository as never),
  new ListCollegesUseCase(repositories.collegeRepository as never),
);

export const courseController = new CourseController(
  new CreateCourseUseCase(repositories.courseRepository as never, repositories.collegeRepository as never, repositories.userRepository as never),
  new UpdateCourseUseCase(repositories.courseRepository as never),
  new GetCourseUseCase(repositories.courseRepository as never),
  new ListCoursesUseCase(repositories.courseRepository as never),
  new PublishCourseUseCase(repositories.courseRepository as never),
);

export const enrollmentController = new EnrollmentController(
  new CreateEnrollmentUseCase(repositories.enrollmentRepository as never, repositories.courseRepository as never, repositories.userRepository as never),
  new GetEnrollmentsUseCase(repositories.enrollmentRepository as never),
  new UpdateProgressUseCase(repositories.enrollmentRepository as never),
);

export const attendanceController = new AttendanceController(
  new MarkAttendanceUseCase(repositories.attendanceRepository as never, repositories.courseRepository as never),
  new GetAttendanceUseCase(repositories.attendanceRepository as never),
  new GetMonthlyReportUseCase(repositories.attendanceRepository as never),
);

export const assignmentController = new AssignmentController(
  new CreateAssignmentUseCase(repositories.assignmentRepository as never, repositories.courseRepository as never),
  new SubmitAssignmentUseCase(repositories.assignmentRepository as never),
  new GradeAssignmentUseCase(repositories.assignmentRepository as never),
  new ListAssignmentsUseCase(repositories.assignmentRepository as never),
);

export const assessmentController = new AssessmentController(
  new CreateMCQUseCase(repositories.mcqTestRepository as never, repositories.courseRepository as never),
  new CreateCodingUseCase(repositories.codingAssessmentRepository as never, repositories.courseRepository as never),
  new SubmitMCQUseCase(repositories.mcqAttemptRepository as never),
  new SubmitCodingUseCase(repositories.codingSubmissionRepository as never, { execute: async () => ({ testCaseResults: [], totalExecutionTime: 0 }) }),
  new GetResultsUseCase(repositories.mcqAttemptRepository as never),
  new GetLeaderboardUseCase(repositories.mcqAttemptRepository as never),
);

export const projectController = new ProjectController(
  new CreateProjectUseCase(repositories.projectRepository as never, repositories.courseRepository as never, repositories.userRepository as never),
  new UpdateProjectUseCase(repositories.projectRepository as never),
  new AddMilestoneUseCase(repositories.projectRepository as never),
  new AddFeedbackUseCase(repositories.projectRepository as never),
  new GetProjectsUseCase(repositories.projectRepository as never),
);

export const certificateController = new CertificateController(
  new GenerateCertificateUseCase(repositories.certificateRepository as never, repositories.enrollmentRepository as never),
  new VerifyCertificateUseCase(repositories.certificateRepository as never),
  new GetCertificatesUseCase(repositories.certificateRepository as never),
);

export const subscriptionController = new SubscriptionController(
  new CreateSubscriptionUseCase(repositories.subscriptionRepository as never, repositories.collegeRepository as never),
  new GetSubscriptionsUseCase(repositories.subscriptionRepository as never),
);

export const notificationController = new NotificationController(
  new GetNotificationsUseCase(repositories.notificationRepository as never),
  new MarkReadUseCase(repositories.notificationRepository as never),
);

export const analyticsController = new AnalyticsController(
  new GetDashboardStatsUseCase({
    getAdminStats: async () => ({ overview: {} as never, recentActivity: [] }),
    getCollegeStats: async () => ({ overview: {} as never, recentActivity: [] }),
    getTrainerStats: async () => ({ overview: {} as never, recentActivity: [] }),
    getStudentStats: async () => ({ overview: {} as never, recentActivity: [] }),
  }),
  new GetStudentGrowthUseCase({
    getStudentGrowth: async () => ({ period: '', labels: [], datasets: [], summary: {} as never }),
  }),
  new GetCourseAnalyticsUseCase({
    getCourseAnalytics: async () => ({
      courseId: '', courseTitle: '', totalEnrollments: 0, activeEnrollments: 0,
      completionRate: 0, averageScore: 0, averageAttendance: 0, dropoutRate: 0,
      monthlyEnrollments: [], scoreDistribution: [],
    }),
  }),
  new GetCollegeAnalyticsUseCase({
    getCollegeAnalytics: async () => ({
      collegeId: '', collegeName: '', totalStudents: 0, totalTrainers: 0, totalCourses: 0,
      activeEnrollments: 0, completionRate: 0, averageAttendance: 0, averageScore: 0,
      subscriptionStatus: '', monthlyTrends: [], topCourses: [], departmentWise: [],
    }),
  }),
);

export const reportController = new ReportController();
export const userController = new UserController();
