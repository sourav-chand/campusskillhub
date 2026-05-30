import { prisma } from '@infrastructure/database/prisma/prisma-client';

import { PrismaUserRepository } from '@infrastructure/database/repositories/PrismaUserRepository';
import { PrismaCollegeRepository } from '@infrastructure/database/repositories/PrismaCollegeRepository';
import { PrismaCourseRepository } from '@infrastructure/database/repositories/PrismaCourseRepository';
import { PrismaEnrollmentRepository } from '@infrastructure/database/repositories/PrismaEnrollmentRepository';
import { PrismaAttendanceRepository } from '@infrastructure/database/repositories/PrismaAttendanceRepository';
import { PrismaAssignmentRepository } from '@infrastructure/database/repositories/PrismaAssignmentRepository';
import { PrismaAssignmentSubmissionRepository } from '@infrastructure/database/repositories/PrismaAssignmentSubmissionRepository';
import { PrismaMCQTestRepository } from '@infrastructure/database/repositories/PrismaMCQTestRepository';
import { PrismaMCQAttemptRepository } from '@infrastructure/database/repositories/PrismaMCQAttemptRepository';
import { PrismaCodingAssessmentRepository } from '@infrastructure/database/repositories/PrismaCodingAssessmentRepository';
import { PrismaCodingSubmissionRepository } from '@infrastructure/database/repositories/PrismaCodingSubmissionRepository';
import { PrismaProjectRepository } from '@infrastructure/database/repositories/PrismaProjectRepository';
import { PrismaCertificateRepository } from '@infrastructure/database/repositories/PrismaCertificateRepository';
import { PrismaSubscriptionRepository } from '@infrastructure/database/repositories/PrismaSubscriptionRepository';
import { PrismaNotificationRepository } from '@infrastructure/database/repositories/PrismaNotificationRepository';
import { PrismaAuditLogRepository } from '@infrastructure/database/repositories/PrismaAuditLogRepository';

import { StorageService } from '@infrastructure/storage/storage.service';
import { EmailService } from '@infrastructure/email/email.service';
import { NotificationService } from '@infrastructure/notifications/notification.service';
import { AuditService } from '@infrastructure/logging/audit.service';

export const userRepository = new PrismaUserRepository(prisma);
export const collegeRepository = new PrismaCollegeRepository(prisma);
export const courseRepository = new PrismaCourseRepository(prisma);
export const enrollmentRepository = new PrismaEnrollmentRepository(prisma);
export const attendanceRepository = new PrismaAttendanceRepository(prisma);
export const assignmentRepository = new PrismaAssignmentRepository(prisma);
export const assignmentSubmissionRepository = new PrismaAssignmentSubmissionRepository(prisma);
export const mcqTestRepository = new PrismaMCQTestRepository(prisma);
export const mcqAttemptRepository = new PrismaMCQAttemptRepository(prisma);
export const codingAssessmentRepository = new PrismaCodingAssessmentRepository(prisma);
export const codingSubmissionRepository = new PrismaCodingSubmissionRepository(prisma);
export const projectRepository = new PrismaProjectRepository(prisma);
export const certificateRepository = new PrismaCertificateRepository(prisma);
export const subscriptionRepository = new PrismaSubscriptionRepository(prisma);
export const notificationRepository = new PrismaNotificationRepository(prisma);
export const auditLogRepository = new PrismaAuditLogRepository(prisma);

export const storageService = new StorageService();
export const emailService = new EmailService();
export const notificationService = new NotificationService(prisma);
export const auditService = new AuditService(prisma);

export const container = {
  prisma,
  repositories: {
    userRepository,
    collegeRepository,
    courseRepository,
    enrollmentRepository,
    attendanceRepository,
    assignmentRepository,
    assignmentSubmissionRepository,
    mcqTestRepository,
    mcqAttemptRepository,
    codingAssessmentRepository,
    codingSubmissionRepository,
    projectRepository,
    certificateRepository,
    subscriptionRepository,
    notificationRepository,
    auditLogRepository,
  },
  services: {
    storageService,
    emailService,
    notificationService,
    auditService,
  },
};
