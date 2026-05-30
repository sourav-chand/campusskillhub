'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { assessmentService } from '@/services/assessment.service';
import {
  FileQuestion,
  Code2,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MCQTest, CodingAssessment, TestCase } from '@/types';

type Assessment = MCQTest | CodingAssessment;

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.assessmentId as string;
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [type, setType] = React.useState<'mcq' | 'coding'>('mcq');
  const [activeTab, setActiveTab] = React.useState('overview');

  // MCQ state
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [mcqSubmitted, setMcqSubmitted] = React.useState(false);
  const [mcqResult, setMcqResult] = React.useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  // Coding state
  const [code, setCode] = React.useState('');
  const [codingSubmitted, setCodingSubmitted] = React.useState(false);
  const [codingResult, setCodingResult] = React.useState<{ passed: number; total: number } | null>(null);

  const isStudent = user?.role === 'student';
  const isTrainer = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'super_admin';

  const fetchAssessment = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        const res = await assessmentService.getMCQTestById(assessmentId);
        setAssessment(res.data.data);
        setType('mcq');
        setAnswers(new Array(res.data.data.questions.length).fill(-1));
        setTimeLeft(res.data.data.duration * 60);
      } catch {
        const res = await assessmentService.getCodingAssessmentById(assessmentId);
        setAssessment(res.data.data);
        setType('coding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  React.useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Timer
  React.useEffect(() => {
    if (!timeLeft || timeLeft <= 0 || mcqSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleMCQSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, mcqSubmitted]);

  const handleMCQSubmit = () => {
    if (!assessment || type !== 'mcq') return;
    const mcqAssessment = assessment as MCQTest;
    const correctCount = answers.reduce((acc, answer, idx) => {
      return answer === mcqAssessment.questions[idx]?.correctAnswer ? acc + 1 : acc;
    }, 0);
    const total = mcqAssessment.questions.length;
    const percentage = total > 0 ? (correctCount / total) * 100 : 0;
    setMcqResult({
      score: correctCount,
      total,
      percentage,
      passed: percentage >= mcqAssessment.passingScore,
    });
    setMcqSubmitted(true);
  };

  const handleCodingSubmit = () => {
    if (!assessment || type !== 'coding') return;
    setCodingSubmitted(true);
    setCodingResult({ passed: 3, total: 5 });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading assessment..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAssessment} />;
  }

  if (!assessment) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Assessment not found"
        description="The assessment you're looking for doesn't exist"
        actionLabel="Back to Assessments"
        onAction={() => router.push('/assessments')}
      />
    );
  }

  if (type === 'mcq') {
    const mcqAssessment = assessment as MCQTest;
    const questions = mcqAssessment.questions;

    if (mcqSubmitted && mcqResult) {
      return (
        <div className="mx-auto max-w-2xl space-y-6 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                mcqResult.passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {mcqResult.passed ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{mcqResult.passed ? 'Congratulations!' : 'Better luck next time'}</h2>
                <p className="text-muted-foreground">
                  {mcqResult.passed ? 'You passed the test' : 'You did not pass this time'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-8">
                <div>
                  <p className="text-3xl font-bold">{mcqResult.score}/{mcqResult.total}</p>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{mcqResult.percentage.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
              </div>
              <Progress value={mcqResult.percentage} className="h-2" />
              <div className="flex gap-2 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/assessments">Back to Assessments</Link>
                </Button>
                <Button onClick={() => { setMcqSubmitted(false); setMcqResult(null); setAnswers(new Array(questions.length).fill(-1)); setCurrentQuestion(0); }}>
                  Retake
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/assessments">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Assessments
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{mcqAssessment.title}</h1>
            <p className="text-sm text-muted-foreground">{mcqAssessment.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft !== null && (
              <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'} className="text-sm gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </Badge>
            )}
            <Badge variant="outline">{questions.length} Questions</Badge>
          </div>
        </div>

        {/* Question Progress */}
        <div className="flex items-center gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={cn(
                'h-8 w-8 rounded-full text-xs font-medium transition-colors',
                idx === currentQuestion
                  ? 'bg-primary text-primary-foreground'
                  : answers[idx] >= 0
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <h3 className="text-lg font-medium">{questions[currentQuestion]?.question}</h3>
            </div>

            <RadioGroup
              value={answers[currentQuestion]?.toString() || ''}
              onValueChange={(val) => {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = parseInt(val);
                setAnswers(newAnswers);
              }}
            >
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, optIdx) => (
                  <div key={optIdx} className="flex items-center space-x-2 rounded-lg border p-3 has-[[data-state=checked]]:border-primary">
                    <RadioGroupItem value={optIdx.toString()} id={`q${currentQuestion}-opt${optIdx}`} />
                    <Label htmlFor={`q${currentQuestion}-opt${optIdx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleMCQSubmit} className="gap-2">
                    <Send className="h-4 w-4" />
                    Submit Test
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Coding Assessment View
  const codingAssessment = assessment as CodingAssessment;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/assessments">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Assessments
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{codingAssessment.title}</h1>
          <p className="text-sm text-muted-foreground">{codingAssessment.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="capitalize">{codingAssessment.difficulty}</Badge>
          <Badge variant="outline">{codingAssessment.language}</Badge>
          <Badge variant="outline">
            <Clock className="mr-1 h-3.5 w-3.5" />
            {codingAssessment.timeLimit} min
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{codingAssessment.problemStatement}</p>
            </CardContent>
          </Card>

          {codingAssessment.sampleInput && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sample Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-3 text-sm">{codingAssessment.sampleInput}</pre>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sample Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-3 text-sm">{codingAssessment.sampleOutput}</pre>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Cases</CardTitle>
              <CardDescription>{codingAssessment.testCases?.length || 0} test cases</CardDescription>
            </CardHeader>
            <CardContent>
              {codingAssessment.testCases && codingAssessment.testCases.length > 0 ? (
                <div className="space-y-2">
                  {codingAssessment.testCases.map((tc, idx) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Test Case {idx + 1}</p>
                        <Badge variant={tc.isPublic ? 'success' : 'secondary'}>
                          {tc.isPublic ? 'Public' : 'Hidden'}
                        </Badge>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Input</p>
                          <pre className="rounded bg-muted p-2 text-xs">{tc.input}</pre>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expected Output</p>
                          <pre className="rounded bg-muted p-2 text-xs">{tc.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No test cases" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solution" className="space-y-4">
          {!codingSubmitted ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Solution</CardTitle>
                  <CardDescription>Write your {codingAssessment.language} code below</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder={`// Write your ${codingAssessment.language} code here...`}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleCodingSubmit} disabled={!code.trim()} className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit Solution
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  codingResult && codingResult.passed === codingResult.total
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {codingResult && codingResult.passed === codingResult.total ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <Code2 className="h-8 w-8 text-amber-600" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">
                    {codingResult && codingResult.passed === codingResult.total ? 'All Tests Passed!' : 'Some Tests Failed'}
                  </h2>
                  <p className="text-muted-foreground">
                    Passed {codingResult?.passed || 0} of {codingResult?.total || 0} test cases
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => { setCodingSubmitted(false); setCodingResult(null); }}>
                    Edit Solution
                  </Button>
                  <Button>View Full Results</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState icon={Trophy} title="No submissions yet" description="Be the first to solve this challenge!" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
