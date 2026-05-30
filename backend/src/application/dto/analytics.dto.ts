export interface DashboardStatsDto {
  overview: {
    totalStudents: number;
    totalTrainers: number;
    totalCourses: number;
    totalColleges: number;
    activeEnrollments: number;
    completionRate: number;
    averageAttendance: number;
    totalRevenue?: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    userId?: string;
    userName?: string;
  }>;
  alerts?: Array<{
    type: 'info' | 'warning' | 'error';
    message: string;
    count: number;
  }>;
}

export interface StudentGrowthDto {
  period: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    growth: number;
    percentageChange: number;
  }>;
  summary: {
    totalStudents: number;
    newThisPeriod: number;
    activeStudents: number;
    droppedStudents: number;
    averageGrowthRate: number;
  };
}

export interface CollegeAnalyticsDto {
  collegeId: string;
  collegeName: string;
  totalStudents: number;
  totalTrainers: number;
  totalCourses: number;
  activeEnrollments: number;
  completionRate: number;
  averageAttendance: number;
  averageScore: number;
  revenue?: number;
  subscriptionStatus: string;
  monthlyTrends: Array<{
    month: string;
    year: number;
    newStudents: number;
    activeStudents: number;
    completions: number;
    revenue?: number;
  }>;
  topCourses: Array<{
    courseId: string;
    courseTitle: string;
    enrollmentCount: number;
    completionRate: number;
    averageRating: number;
  }>;
  departmentWise: Array<{
    department: string;
    studentCount: number;
    averagePerformance: number;
  }>;
}
