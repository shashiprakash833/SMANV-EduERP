/**
 * SMANV EduERP Enterprise TypeScript Definitions
 * Developed by SMANV Info Tech Private Limited
 */

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'staff'
  | 'student'
  | 'parent'
  | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  organizationId: string;
  organizationName: string;
  designation?: string;
  department?: string;
  studentId?: string; // For student/parent roles
  grade?: string;
  section?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university' | 'institute';
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logoUrl?: string;
  studentCount: number;
  staffCount: number;
  establishedYear: number;
  academicYear: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  attendanceRate: number; // e.g., 94.5
  feeStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  pendingAmount: number;
  avatarUrl?: string;
  qrCode: string;
}

export interface Staff {
  id: string;
  name: string;
  employeeCode: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  qualification: string;
  joiningDate: string;
  status: 'In Class' | 'On Duty' | 'On Leave';
  attendanceRate: number;
  subjects: string[];
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'student' | 'staff';
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  grade?: string;
  section?: string;
  department?: string;
  timeIn?: string;
  remarks?: string;
}

export interface ClassSession {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  grade: string;
  section: string;
  room: string;
  teacherName: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  assignedDate: string;
  totalMarks: number;
  submissionsCount: number;
  totalStudents: number;
  status: 'Active' | 'Under Review' | 'Graded';
  description: string;
}

export interface Examination {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  maxMarks: number;
  passPercentage: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface FeeRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  category: 'Tuition' | 'Transport' | 'Laboratory' | 'Sports' | 'Annual';
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  paymentMode?: 'Online' | 'Cash' | 'Cheque' | 'UPI';
  qrCode: string;
}

export interface ReportMetric {
  id: string;
  title: string;
  category: 'academic' | 'attendance' | 'financial' | 'admissions';
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Academics' | 'Fees' | 'Attendance' | 'General' | 'AI Alerts';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRoute?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  type: 'attendance' | 'fee' | 'performance' | 'workload';
  severity: 'info' | 'warning' | 'critical' | 'success';
  description: string;
  recommendation: string;
  metric?: string;
  actionText?: string;
  actionRoute?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  timestamp: string;
  user: string;
  type: 'fee' | 'academic' | 'attendance' | 'admission' | 'system';
  icon: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'High' | 'Normal';
  targetRoles: UserRole[];
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  gradeApplying: string;
  parentName: string;
  parentPhone: string;
  appliedDate: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Enrolled' | 'Rejected';
  previousSchool: string;
  notes?: string;
}

// -------------------------------------------------------------
// Django REST Framework (DRF) Authentication & API Interfaces
// -------------------------------------------------------------

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface RegisterOrgPayload {
  organization: Partial<Organization>;
  admin: AdminRegistrationData;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
  organization: Organization;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[] | string>;
  status?: number;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

