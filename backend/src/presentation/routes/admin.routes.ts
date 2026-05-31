import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@infrastructure/database/prisma/prisma-client';
import { authenticate } from '@presentation/middleware/auth.middleware';
import { authorize } from '@presentation/middleware/rbac.middleware';
import { validate } from '@presentation/middleware/validate.middleware';
import { AppError } from '@shared/errors/AppError';
import { generateRandomPassword } from '@shared/utils/helpers';

const router = Router();

const CreateTrainerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  company: z.string().trim().max(200).optional(),
  specialization: z.string().trim().max(200).optional(),
  expertise: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(1000).optional(),
});

const CreateCollegeAdminSchema = z.object({
  collegeName: z.string().trim().min(2, 'College name must be at least 2 characters').max(200),
  collegeCode: z.string().trim().min(2, 'College code must be at least 2 characters').max(20),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(500),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  collegePhone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'College phone must be 10-15 digits'),
  collegeEmail: z.string().trim().toLowerCase().email('Invalid college email'),
  adminFirstName: z.string().trim().min(1, 'First name is required').max(100),
  adminLastName: z.string().trim().min(1, 'Last name is required').max(100),
  adminEmail: z.string().trim().toLowerCase().email('Invalid admin email'),
  adminPhone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number').optional(),
  department: z.string().trim().max(100).optional(),
  designation: z.string().trim().max(100).optional(),
});

router.post(
  '/college-admin',
  authenticate,
  authorize('super_admin'),
  validate({ body: CreateCollegeAdminSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const existingCollege = await prisma.college.findUnique({ where: { code: data.collegeCode } });
      if (existingCollege) {
        throw new AppError('College with this code already exists', 409);
      }

      const existingEmail = await prisma.user.findUnique({ where: { email: data.adminEmail } });
      if (existingEmail) {
        throw new AppError('Admin email already registered', 409);
      }

      const temporaryPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      const college = await prisma.college.create({
        data: {
          name: data.collegeName,
          code: data.collegeCode,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.collegePhone,
          email: data.collegeEmail,
          status: 'APPROVED',
          maxStudents: 500,
        },
      });

      const user = await prisma.user.create({
        data: {
          email: data.adminEmail,
          password: hashedPassword,
          firstName: data.adminFirstName,
          lastName: data.adminLastName,
          role: 'COLLEGE_ADMIN',
          phone: data.adminPhone || null,
          isVerified: true,
          isActive: true,
        },
      });

      await prisma.collegeAdmin.create({
        data: {
          userId: user.id,
          collegeId: college.id,
          department: data.department || null,
          designation: data.designation || null,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          college: {
            id: college.id,
            name: college.name,
            code: college.code,
          },
          admin: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          temporaryPassword,
        },
        message: 'College admin created successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/trainer',
  authenticate,
  authorize('super_admin'),
  validate({ body: CreateTrainerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingEmail) {
        throw new AppError('Email already registered', 409);
      }

      const temporaryPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'TRAINER',
          phone: data.phone || null,
          isVerified: true,
          isActive: true,
        },
      });

      await prisma.trainer.create({
        data: {
          userId: user.id,
          company: data.company || null,
          specialization: data.specialization || null,
          expertise: data.expertise ? data.expertise.split(',').map((e: string) => e.trim()) : [],
          bio: data.bio || null,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          trainer: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          company: data.company || null,
          temporaryPassword,
        },
        message: 'Trainer created successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
