export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COLLEGE_ADMIN = 'COLLEGE_ADMIN',
  TRAINER = 'TRAINER',
  STUDENT = 'STUDENT',
}

export enum CollegeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum CourseCategory {
  FULL_STACK_DEVELOPMENT = 'FULL_STACK_DEVELOPMENT',
  DEVOPS = 'DEVOPS',
  CLOUD_COMPUTING = 'CLOUD_COMPUTING',
  JAVA = 'JAVA',
  DOTNET = 'DOTNET',
  PYTHON = 'PYTHON',
  DATA_SCIENCE = 'DATA_SCIENCE',
}

export enum AssessmentType {
  MCQ = 'MCQ',
  CODING = 'CODING',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum ProjectType {
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
}

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum CertificateStatus {
  PENDING = 'PENDING',
  GENERATED = 'GENERATED',
  REVOKED = 'REVOKED',
}
