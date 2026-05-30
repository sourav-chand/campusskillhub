import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@config/index';
import { AppError } from '@shared/errors/AppError';

const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createStorage = (subPath: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.join(config.storage.localPath, subPath);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${uuidv4()}${ext}`;
      cb(null, name);
    },
  });

const videoFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only video files (mp4, webm, ogg, mov) are allowed', 400));
  }
};

const pdfFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowed = ['application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed', 400));
  }
};

const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpg, png, gif, webp, svg) are allowed', 400));
  }
};

const assignmentFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('File type not allowed for assignments', 400));
  }
};

const VIDEO_SIZE_LIMIT = 500 * 1024 * 1024;
const PDF_SIZE_LIMIT = 50 * 1024 * 1024;
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;
const ASSIGNMENT_SIZE_LIMIT = 100 * 1024 * 1024;

export const upload = multer({
  storage: createStorage('general'),
  limits: { fileSize: config.storage.maxFileSize },
});

export const uploadVideo = multer({
  storage: createStorage('videos'),
  fileFilter: videoFileFilter,
  limits: { fileSize: VIDEO_SIZE_LIMIT },
});

export const uploadPdf = multer({
  storage: createStorage('pdfs'),
  fileFilter: pdfFileFilter,
  limits: { fileSize: PDF_SIZE_LIMIT },
});

export const uploadImage = multer({
  storage: createStorage('images'),
  fileFilter: imageFileFilter,
  limits: { fileSize: IMAGE_SIZE_LIMIT },
});

export const uploadAssignment = multer({
  storage: createStorage('assignments'),
  fileFilter: assignmentFileFilter,
  limits: { fileSize: ASSIGNMENT_SIZE_LIMIT },
});
