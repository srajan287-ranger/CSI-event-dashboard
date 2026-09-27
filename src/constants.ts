export const CATEGORIES = [
  'Workshop',
  'Hackathon',
  'Seminar',
  'Competition',
  'Webinar',
  'Technical Talk',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'] as const;
export type Status = (typeof STATUSES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Workshop: '#3b82f6',
  Hackathon: '#f59e0b',
  Seminar: '#10b981',
  Competition: '#ef4444',
  Webinar: '#8b5cf6',
  'Technical Talk': '#06b6d4',
  Other: '#6b7280',
};

export const STATUS_COLORS: Record<Status, string> = {
  Upcoming: '#3b82f6',
  Ongoing: '#f59e0b',
  Completed: '#10b981',
  Cancelled: '#ef4444',
};

export const STATUS_STYLES: Record<Status, string> = {
  Upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 ring-blue-600/20',
  Ongoing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 ring-amber-600/20',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 ring-emerald-600/20',
  Cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 ring-rose-600/20',
};

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical',
  'Civil',
  'Electrical',
] as const;

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export const ATTENDANCE_STATUS = ['Registered', 'Attended', 'Absent'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[number];
