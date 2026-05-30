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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = config.storage.localPath;
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${uuidv4()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'video/mp4',
    'video/webm',
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.storage.maxFileSize },
});

export class StorageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.storage.baseUrl;
  }

  async upload(file: Express.Multer.File, subPath?: string): Promise<string> {
    const targetDir = subPath
      ? path.join(config.storage.localPath, subPath)
      : config.storage.localPath;

    ensureDir(targetDir);

    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const targetPath = path.join(targetDir, fileName);

    fs.renameSync(file.path, targetPath);

    const relativePath = subPath ? `${subPath}/${fileName}` : fileName;
    return `${this.baseUrl}/${relativePath}`.replace(/\\/g, '/');
  }

  async delete(fileUrl: string): Promise<void> {
    const relativePath = fileUrl.replace(this.baseUrl, '').replace(/^\//, '');
    const filePath = path.join(config.storage.localPath, relativePath);

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/${key}`.replace(/\\/g, '/');
  }
}

export const storageService = new StorageService();
