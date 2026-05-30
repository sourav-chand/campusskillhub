import { Attendance } from '../entities/Attendance';

export interface IAttendanceRepository {
  findById(id: string): Promise<Attendance | null>;
  create(attendance: Attendance): Promise<Attendance>;
  update(id: string, data: Partial<Attendance>): Promise<Attendance | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Attendance[]>;
  findByStudent(studentId: string): Promise<Attendance[]>;
  findByDate(date: Date): Promise<Attendance[]>;
  findByClass(liveClassId: string): Promise<Attendance[]>;
  getMonthlyReport(studentId: string, year: number, month: number): Promise<Attendance[]>;
}
