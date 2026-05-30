import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';

import { config } from '@config/index';
import { swaggerSpec } from '@config/swagger';
import { prisma } from '@infrastructure/database/prisma/prisma-client';
import { configurePassport } from '@infrastructure/auth/passport';
import passport from 'passport';
import routes from '@presentation/routes/index';
import { errorHandler } from '@presentation/middleware/error.middleware';
import { generalLimiter } from '@presentation/middleware/rate-limit.middleware';
import { logger } from '@shared/utils/logger';

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  },
});

app.set('io', io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.cors.origin, credentials: config.cors.credentials }));
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(generalLimiter);

app.use('/uploads', express.static(path.resolve(config.storage.localPath)));

configurePassport(prisma);
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CampusSkill Hub API Docs',
}));

app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusSkill Hub API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
    logger.debug(`Socket ${socket.id} joined user:${userId}`);
  });

  socket.on('join-college', (collegeId: string) => {
    socket.join(`college:${collegeId}`);
    logger.debug(`Socket ${socket.id} joined college:${collegeId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

export const sendNotification = (userId: string, event: string, data: unknown): void => {
  io.to(`user:${userId}`).emit(event, data);
};

export const sendCollegeNotification = (collegeId: string, event: string, data: unknown): void => {
  io.to(`college:${collegeId}`).emit(event, data);
};

cron.schedule('0 0 * * *', async () => {
  logger.info('Running daily cron: auto-generate certificates');
  try {
    const completedEnrollments = await prisma.enrollment.findMany({
      where: {
        isCompleted: true,
        completedAt: {
          not: null,
        },
      },
      include: {
        student: true,
        course: true,
      },
    });

    for (const enrollment of completedEnrollments) {
      const existingCert = await prisma.certificate.findUnique({
        where: {
          studentId_courseId: {
            studentId: enrollment.studentId,
            courseId: enrollment.courseId,
          },
        },
      });

      if (!existingCert) {
        const certId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        await prisma.certificate.create({
          data: {
            certificateId: certId,
            title: enrollment.course.title,
            studentId: enrollment.studentId,
            courseId: enrollment.courseId,
            issueDate: new Date(),
            status: 'GENERATED',
          },
        });
        logger.info(`Certificate auto-generated for enrollment ${enrollment.id}`);
      }
    }
  } catch (error) {
    logger.error('Error in certificate cron job', { error });
  }
});

cron.schedule('0 8 * * *', async () => {
  logger.info('Running daily cron: send reminders');
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingAssignments = await prisma.assignment.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: tomorrow,
        },
      },
      include: {
        course: {
          include: {
            enrollments: {
              where: { isCompleted: false },
            },
          },
        },
      },
    });

    for (const assignment of upcomingAssignments) {
      for (const enrollment of assignment.course.enrollments) {
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: enrollment.studentId,
            title: `Reminder: ${assignment.title}`,
            createdAt: { gte: today },
          },
        });

        if (!existingNotification) {
          await prisma.notification.create({
            data: {
              title: `Reminder: ${assignment.title}`,
              message: `Assignment "${assignment.title}" is due soon. Please submit before ${assignment.dueDate.toLocaleDateString()}.`,
              type: 'IN_APP',
              category: 'ASSIGNMENT',
              userId: enrollment.studentId,
            },
          });
        }
      }
    }
  } catch (error) {
    logger.error('Error in reminder cron job', { error });
  }
});

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Connected to database');

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`API: http://localhost:${config.port}/api`);
      logger.info(`Docs: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  io.close();
  logger.info('Socket.IO server closed');

  await prisma.$disconnect();
  logger.info('Database connection closed');

  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app, httpServer, io };
