import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CampusSkill Hub API',
    version: '1.0.0',
    description: 'Training and Student Progress Management Platform API',
    contact: {
      name: 'CampusSkill Hub',
      email: 'support@campusskillhub.com',
    },
  },
  servers: [
    {
      url: config.app.url,
      description: 'Development server',
    },
    {
      url: 'https://api.campusskillhub.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT Bearer token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'object' },
          stack: { type: 'string' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 10 },
          hasNextPage: { type: 'boolean', example: true },
          hasPreviousPage: { type: 'boolean', example: false },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['student', 'trainer', 'admin', 'college_admin'] },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          isActive: { type: 'boolean' },
          isEmailVerified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  expiresIn: { type: 'integer' },
                },
              },
            },
          },
        },
      },
      College: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          code: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          pincode: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          website: { type: 'string' },
          isActive: { type: 'boolean' },
          isApproved: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          duration: { type: 'integer' },
          price: { type: 'number' },
          isPublished: { type: 'boolean' },
          collegeId: { type: 'string', format: 'uuid' },
          trainerId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Enrollment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          studentId: { type: 'string', format: 'uuid' },
          courseId: { type: 'string', format: 'uuid' },
          progress: { type: 'number' },
          status: { type: 'string', enum: ['active', 'completed', 'dropped', 'paused'] },
          startedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      Attendance: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          studentId: { type: 'string', format: 'uuid' },
          date: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'] },
          remarks: { type: 'string' },
        },
      },
      Assignment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', format: 'date-time' },
          maxScore: { type: 'integer' },
          courseId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Assessment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          type: { type: 'string', enum: ['mcq', 'coding'] },
          duration: { type: 'integer' },
          passingScore: { type: 'integer' },
          courseId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['not_started', 'in_progress', 'completed', 'on_hold'] },
          progress: { type: 'number' },
          technologies: { type: 'array', items: { type: 'string' } },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
        },
      },
      Certificate: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          certificateNumber: { type: 'string' },
          studentId: { type: 'string', format: 'uuid' },
          courseId: { type: 'string', format: 'uuid' },
          issueDate: { type: 'string', format: 'date-time' },
          isValid: { type: 'boolean' },
        },
      },
      Subscription: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          collegeId: { type: 'string', format: 'uuid' },
          plan: { type: 'string' },
          status: { type: 'string', enum: ['active', 'expired', 'cancelled', 'pending'] },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          message: { type: 'string' },
          type: { type: 'string' },
          isRead: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
        responses: { '201': { description: 'User registered successfully' }, '400': { description: 'Validation error' }, '409': { description: 'Email already exists' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: { '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { '200': { description: 'Reset email sent if account exists' } },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password with token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, password: { type: 'string', format: 'password' }, confirmPassword: { type: 'string', format: 'password' } } } } } },
        responses: { '200': { description: 'Password reset successfully' }, '400': { description: 'Invalid or expired token' } },
      },
    },
    '/api/auth/verify-email/{token}': {
      get: {
        tags: ['Authentication'],
        summary: 'Verify email address',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Email verified successfully' }, '400': { description: 'Invalid token' } },
      },
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } },
        responses: { '200': { description: 'Tokens refreshed' }, '401': { description: 'Invalid refresh token' } },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Logged out successfully' } },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Current user data' }, '401': { description: 'Not authenticated' } },
      },
    },
    '/api/colleges': {
      post: {
        tags: ['Colleges'],
        summary: 'Create a new college',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/College' } } } },
        responses: { '201': { description: 'College created' }, '400': { description: 'Validation error' } },
      },
      get: {
        tags: ['Colleges'],
        summary: 'List all colleges',
        responses: { '200': { description: 'List of colleges' } },
      },
    },
    '/api/colleges/{id}': {
      get: {
        tags: ['Colleges'],
        summary: 'Get college by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'College details' }, '404': { description: 'College not found' } },
      },
      put: {
        tags: ['Colleges'],
        summary: 'Update college',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'College updated' } },
      },
    },
    '/api/colleges/{id}/approve': {
      patch: {
        tags: ['Colleges'],
        summary: 'Approve college',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'College approved' } },
      },
    },
    '/api/courses': {
      post: {
        tags: ['Courses'],
        summary: 'Create a new course',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
        responses: { '201': { description: 'Course created' } },
      },
      get: {
        tags: ['Courses'],
        summary: 'List all courses',
        responses: { '200': { description: 'List of courses' } },
      },
    },
    '/api/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get course by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course details' } },
      },
      put: {
        tags: ['Courses'],
        summary: 'Update course',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course updated' } },
      },
    },
    '/api/courses/{id}/publish': {
      patch: {
        tags: ['Courses'],
        summary: 'Publish/unpublish course',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course publish status updated' } },
      },
    },
    '/api/courses/categories/list': {
      get: {
        tags: ['Courses'],
        summary: 'Get course categories',
        responses: { '200': { description: 'List of categories' } },
      },
    },
    '/api/enrollments': {
      post: {
        tags: ['Enrollments'],
        summary: 'Enroll student in course',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Enrolled successfully' } },
      },
    },
    '/api/enrollments/student/{studentId}': {
      get: {
        tags: ['Enrollments'],
        summary: 'Get enrollments by student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Student enrollments' } },
      },
    },
    '/api/enrollments/course/{courseId}': {
      get: {
        tags: ['Enrollments'],
        summary: 'Get enrollments by course',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course enrollments' } },
      },
    },
    '/api/enrollments/{id}/progress': {
      patch: {
        tags: ['Enrollments'],
        summary: 'Update enrollment progress',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Progress updated' } },
      },
    },
    '/api/attendance': {
      post: {
        tags: ['Attendance'],
        summary: 'Mark attendance',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Attendance marked' } },
      },
    },
    '/api/attendance/student/{studentId}': {
      get: {
        tags: ['Attendance'],
        summary: 'Get attendance by student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Student attendance records' } },
      },
    },
    '/api/attendance/report/monthly': {
      get: {
        tags: ['Attendance'],
        summary: 'Get monthly attendance report',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Monthly attendance report' } },
      },
    },
    '/api/assignments': {
      post: {
        tags: ['Assignments'],
        summary: 'Create assignment',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Assignment created' } },
      },
    },
    '/api/assignments/submit': {
      post: {
        tags: ['Assignments'],
        summary: 'Submit assignment',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Assignment submitted' } },
      },
    },
    '/api/assignments/grade': {
      post: {
        tags: ['Assignments'],
        summary: 'Grade assignment submission',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Assignment graded' } },
      },
    },
    '/api/assignments/course/{courseId}': {
      get: {
        tags: ['Assignments'],
        summary: 'List assignments by course',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course assignments' } },
      },
    },
    '/api/assignments/student/{studentId}': {
      get: {
        tags: ['Assignments'],
        summary: 'List assignments by student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Student assignments' } },
      },
    },
    '/api/assessments/mcq': {
      post: {
        tags: ['Assessments'],
        summary: 'Create MCQ assessment',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'MCQ assessment created' } },
      },
    },
    '/api/assessments/mcq/submit': {
      post: {
        tags: ['Assessments'],
        summary: 'Submit MCQ attempt',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'MCQ submitted' } },
      },
    },
    '/api/assessments/coding': {
      post: {
        tags: ['Assessments'],
        summary: 'Create coding assessment',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Coding assessment created' } },
      },
    },
    '/api/assessments/coding/submit': {
      post: {
        tags: ['Assessments'],
        summary: 'Submit coding attempt',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Coding submitted' } },
      },
    },
    '/api/projects': {
      post: {
        tags: ['Projects'],
        summary: 'Create project',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Project created' } },
      },
      get: {
        tags: ['Projects'],
        summary: 'List projects',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of projects' } },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Project details' } },
      },
      put: {
        tags: ['Projects'],
        summary: 'Update project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Project updated' } },
      },
    },
    '/api/projects/{id}/milestones': {
      post: {
        tags: ['Projects'],
        summary: 'Add milestone to project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '201': { description: 'Milestone added' } },
      },
    },
    '/api/projects/{id}/feedback': {
      post: {
        tags: ['Projects'],
        summary: 'Add feedback to project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Feedback added' } },
      },
    },
    '/api/certificates/generate': {
      post: {
        tags: ['Certificates'],
        summary: 'Generate certificate',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Certificate generated' } },
      },
    },
    '/api/certificates/verify/{certificateNumber}': {
      get: {
        tags: ['Certificates'],
        summary: 'Verify certificate',
        parameters: [{ name: 'certificateNumber', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Certificate verification result' } },
      },
    },
    '/api/certificates/student/{studentId}': {
      get: {
        tags: ['Certificates'],
        summary: 'Get certificates by student',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Student certificates' } },
      },
    },
    '/api/subscriptions': {
      post: {
        tags: ['Subscriptions'],
        summary: 'Create subscription',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Subscription created' } },
      },
      get: {
        tags: ['Subscriptions'],
        summary: 'List subscriptions',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of subscriptions' } },
      },
    },
    '/api/subscriptions/current/{collegeId}': {
      get: {
        tags: ['Subscriptions'],
        summary: 'Get current subscription for college',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'collegeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Current subscription' } },
      },
    },
    '/api/subscriptions/{id}/cancel': {
      patch: {
        tags: ['Subscriptions'],
        summary: 'Cancel subscription',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Subscription cancelled' } },
      },
    },
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List user notifications',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of notifications' } },
      },
    },
    '/api/notifications/{id}/read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Notification marked as read' } },
      },
    },
    '/api/notifications/read-all': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'All notifications marked as read' } },
      },
    },
    '/api/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get unread notification count',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Unread count' } },
      },
    },
    '/api/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Get dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Dashboard stats' } },
      },
    },
    '/api/analytics/student-growth': {
      get: {
        tags: ['Analytics'],
        summary: 'Get student growth data',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Student growth data' } },
      },
    },
    '/api/analytics/courses/{courseId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get course analytics',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Course analytics' } },
      },
    },
    '/api/analytics/colleges/{collegeId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get college analytics',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'collegeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'College analytics' } },
      },
    },
    '/api/reports/attendance': {
      get: {
        tags: ['Reports'],
        summary: 'Get attendance report',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Attendance report' } },
      },
    },
    '/api/reports/performance': {
      get: {
        tags: ['Reports'],
        summary: 'Get performance report',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Performance report' } },
      },
    },
    '/api/reports/assessment': {
      get: {
        tags: ['Reports'],
        summary: 'Get assessment report',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Assessment report' } },
      },
    },
    '/api/reports/completion': {
      get: {
        tags: ['Reports'],
        summary: 'Get completion report',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Completion report' } },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of users' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'User details' }, '404': { description: 'User not found' } },
      },
    },
    '/api/users/profile': {
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Profile updated' } },
      },
    },
    '/api/users/change-password': {
      post: {
        tags: ['Users'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Password changed' } },
      },
    },
    '/api/users/{id}/deactivate': {
      patch: {
        tags: ['Users'],
        summary: 'Deactivate user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'User deactivated' } },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});
