import type { Category, Status } from '@/constants';

export interface Speaker {
  name: string;
  designation: string;
  organization: string;
}

export interface EventItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  date: string; // ISO yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  venue: string;
  speaker: Speaker;
  capacity: number;
  registrations: number;
  bannerUrl: string;
  registrationDeadline: string;
  status: Status;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  participantName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  registrationDate: string;
  attendance: 'Registered' | 'Attended' | 'Absent';
}
