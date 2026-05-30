import { SubmitMCQAttemptDto, SubmitMCQAttemptDtoSchema, MCQResultDto, QuestionResultDto } from '../../dto/mcq.dto';
import { AppError } from '../../../shared/errors/AppError';

interface MCQQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  points: number;
  explanation?: string;
}

interface MCQTestData {
  id: string;
  title: string;
  questions: MCQQuestion[];
  passingScore: number;
  maxAttempts: number;
  deadline?: Date;
}

export interface IAssessmentRepository {
  findMCQTestById(id: string): Promise<MCQTestData | null>;
  countAttempts(testId: string, studentId: string): Promise<number>;
  saveAttempt(data: unknown): Promise<unknown>;
}

export class SubmitMCQUseCase {
  constructor(private assessmentRepository: IAssessmentRepository) {}

  async execute(dto: SubmitMCQAttemptDto): Promise<MCQResultDto> {
    const parsed = SubmitMCQAttemptDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const test = await this.assessmentRepository.findMCQTestById(parsed.data.testId);
    if (!test) {
      throw new AppError('MCQ test not found', 404);
    }

    if (test.deadline && new Date() > test.deadline) {
      throw new AppError('Test deadline has passed', 400);
    }

    const attemptCount = await this.assessmentRepository.countAttempts(
      parsed.data.testId,
      parsed.data.studentId,
    );
    if (attemptCount >= test.maxAttempts) {
      throw new AppError('Maximum attempts reached', 400);
    }

    const questionResults: QuestionResultDto[] = [];
    let totalPointsAwarded = 0;
    let correctCount = 0;

    for (const answer of parsed.data.answers) {
      const question = test.questions.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new AppError(`Question ${answer.questionId} not found in test`, 400);
      }

      const correctOptions = question.options
        .map((opt, idx) => (opt.isCorrect ? idx : -1))
        .filter((idx) => idx !== -1);

      const isCorrect =
        JSON.stringify([...answer.selectedOptions].sort()) ===
        JSON.stringify([...correctOptions].sort());

      const pointsAwarded = isCorrect ? question.points : 0;
      if (isCorrect) correctCount++;
      totalPointsAwarded += pointsAwarded;

      questionResults.push({
        questionId: question.id,
        questionText: question.questionText,
        selectedOptions: answer.selectedOptions,
        correctOptions,
        isCorrect,
        points: question.points,
        pointsAwarded,
        explanation: question.explanation,
      });
    }

    const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = totalPoints > 0 ? Math.round((totalPointsAwarded / totalPoints) * 100) : 0;
    const passed = percentage >= test.passingScore;

    const attempt = await this.assessmentRepository.saveAttempt({
      testId: parsed.data.testId,
      studentId: parsed.data.studentId,
      answers: parsed.data.answers,
      score: totalPointsAwarded,
      totalPoints,
      percentage,
      passed,
      correctAnswers: correctCount,
      incorrectAnswers: test.questions.length - correctCount,
      totalQuestions: test.questions.length,
      answeredQuestions: parsed.data.answers.length,
      timeSpent: parsed.data.timeSpent,
      submittedAt: new Date(),
    });

    return {
      attemptId: attempt.id,
      testId: test.id,
      testTitle: test.title,
      studentId: parsed.data.studentId,
      studentName: '',
      totalQuestions: test.questions.length,
      answeredQuestions: parsed.data.answers.length,
      correctAnswers: correctCount,
      incorrectAnswers: test.questions.length - correctCount,
      score: totalPointsAwarded,
      totalPoints,
      pointsAwarded: totalPointsAwarded,
      percentage,
      passed,
      timeSpent: parsed.data.timeSpent,
      questions: questionResults,
      submittedAt: new Date(),
    };
  }
}
