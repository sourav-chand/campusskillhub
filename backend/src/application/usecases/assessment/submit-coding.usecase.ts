import { SubmitCodingDto, SubmitCodingDtoSchema, CodingResultDto, TestCaseResultDto } from '../../dto/coding.dto';
import { AppError } from '../../../shared/errors/AppError';

interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
  points: number;
}

interface CodingAssessmentData {
  id: string;
  title: string;
  testCases: CodingTestCase[];
  passingScore: number;
  maxAttempts: number;
  deadline?: Date;
}

export interface IAssessmentRepository {
  findCodingAssessmentById(id: string): Promise<CodingAssessmentData | null>;
  countCodingAttempts(assessmentId: string, studentId: string): Promise<number>;
  saveCodingAttempt(data: unknown): Promise<unknown>;
}

export interface ICodeExecutor {
  execute(code: string, language: string, testCases: CodingTestCase[]): Promise<{
    testCaseResults: TestCaseResultDto[];
    totalExecutionTime?: number;
  }>;
}

export class SubmitCodingUseCase {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private codeExecutor: ICodeExecutor,
  ) {}

  async execute(dto: SubmitCodingDto): Promise<CodingResultDto> {
    const parsed = SubmitCodingDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const assessment = await this.assessmentRepository.findCodingAssessmentById(parsed.data.assessmentId);
    if (!assessment) {
      throw new AppError('Coding assessment not found', 404);
    }

    if (assessment.deadline && new Date() > assessment.deadline) {
      throw new AppError('Assessment deadline has passed', 400);
    }

    const attemptCount = await this.assessmentRepository.countCodingAttempts(
      parsed.data.assessmentId,
      parsed.data.studentId,
    );
    if (attemptCount >= assessment.maxAttempts) {
      throw new AppError('Maximum attempts reached', 400);
    }

    const { testCaseResults, totalExecutionTime } = await this.codeExecutor.execute(
      parsed.data.code,
      parsed.data.language,
      assessment.testCases,
    );

    const passedCount = testCaseResults.filter((r) => r.passed).length;
    const totalPoints = assessment.testCases.reduce((sum, tc) => sum + tc.points, 0);
    const pointsAwarded = testCaseResults.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const percentage = totalPoints > 0 ? Math.round((pointsAwarded / totalPoints) * 100) : 0;
    const passed = percentage >= assessment.passingScore;

    const attempt = await this.assessmentRepository.saveCodingAttempt({
      assessmentId: parsed.data.assessmentId,
      studentId: parsed.data.studentId,
      code: parsed.data.code,
      language: parsed.data.language,
      score: pointsAwarded,
      totalPoints,
      percentage,
      passed,
      passedTestCases: passedCount,
      failedTestCases: testCaseResults.length - passedCount,
      executionTime: totalExecutionTime,
      submittedAt: new Date(),
    });

    return {
      attemptId: attempt.id,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      studentId: parsed.data.studentId,
      studentName: '',
      language: parsed.data.language,
      totalTestCases: testCaseResults.length,
      passedTestCases: passedCount,
      failedTestCases: testCaseResults.length - passedCount,
      score: pointsAwarded,
      totalPoints,
      pointsAwarded,
      percentage,
      passed,
      testCaseResults,
      submittedCode: parsed.data.code,
      submittedAt: new Date(),
      executionTime: totalExecutionTime,
    };
  }
}
