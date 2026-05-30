import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { config } from '@config/index';
import { logger } from '@shared/utils/logger';

const loadTemplate = (templateName: string): HandlebarsTemplateDelegate => {
  const templatePath = path.resolve(__dirname, `../../templates/emails/${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateSource);
};

let verificationTemplate: HandlebarsTemplateDelegate | null = null;
let resetPasswordTemplate: HandlebarsTemplateDelegate | null = null;

const getVerificationTemplate = (): HandlebarsTemplateDelegate => {
  if (!verificationTemplate) {
    verificationTemplate = loadTemplate('verification');
  }
  return verificationTemplate;
};

const getResetPasswordTemplate = (): HandlebarsTemplateDelegate => {
  if (!resetPasswordTemplate) {
    resetPasswordTemplate = loadTemplate('reset-password');
  }
  return resetPasswordTemplate;
};

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export class EmailService {
  private from: string;

  constructor() {
    this.from = config.email.from;
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${config.app.clientUrl}/verify-email?token=${token}`;

    try {
      const html = getVerificationTemplate()({ verificationUrl, year: new Date().getFullYear() });

      await transporter.sendMail({
        from: this.from,
        to,
        subject: 'Verify Your Email - CampusSkill Hub',
        html,
      });

      logger.info(`Verification email sent to ${to}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${to}`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${config.app.clientUrl}/reset-password?token=${token}`;

    try {
      const html = getResetPasswordTemplate()({ resetUrl, year: new Date().getFullYear() });

      await transporter.sendMail({
        from: this.from,
        to,
        subject: 'Reset Your Password - CampusSkill Hub',
        html,
      });

      logger.info(`Password reset email sent to ${to}`);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }

  async sendNotification(
    to: string,
    subject: string,
    templateName: string,
    context?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const template = loadTemplate(templateName);
      const html = template({ ...context, year: new Date().getFullYear() });

      await transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });

      logger.info(`Notification email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error(`Failed to send notification email to ${to}`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
