import { Request, Response, NextFunction } from 'express';
import { GenerateCertificateUseCase } from '@application/usecases/certificate/generate-certificate.usecase';
import { VerifyCertificateUseCase } from '@application/usecases/certificate/verify-certificate.usecase';
import { GetCertificatesUseCase } from '@application/usecases/certificate/get-certificates.usecase';

export class CertificateController {
  constructor(
    private generateCertificateUseCase: GenerateCertificateUseCase,
    private verifyCertificateUseCase: VerifyCertificateUseCase,
    private getCertificatesUseCase: GetCertificatesUseCase,
  ) {}

  generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.generateCertificateUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { certificateNumber } = req.params;
      const result = await this.verifyCertificateUseCase.execute(certificateNumber);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  listByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCertificatesUseCase.execute({
        studentId: req.params.studentId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { certificateRepository } = await import('@config/container');
      const certificate = await (certificateRepository as never as { findById: (id: string) => Promise<{ certificateNumber: string } | null> }).findById(req.params.id);
      if (!certificate) {
        res.status(404).json({ success: false, message: 'Certificate not found' });
        return;
      }
      res.status(200).json({ success: true, data: { certificate, downloadUrl: `/api/certificates/${req.params.id}/file` } });
    } catch (error) {
      next(error);
    }
  };
}
