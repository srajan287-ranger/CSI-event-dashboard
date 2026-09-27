import type { Registration } from '@/types';
import { DEPARTMENTS, YEARS } from '@/constants';

const firstNames = [
  'Aman', 'Priya', 'Rahul', 'Sneha', 'Karan', 'Ananya', 'Rohit', 'Meera',
  'Vivek', 'Riya', 'Aditya', 'Sanjay', 'Neha', 'Arjun', 'Kavya', 'Dhruv',
  'Ishaan', 'Tanvi', 'Manav', 'Pooja', 'Sahil', 'Anika', 'Yash', 'Zara',
  'Dev', 'Aisha', 'Nikhil', 'Riya', 'Aryan', 'Sara',
];
const lastNames = [
  'Sharma', 'Verma', 'Mehta', 'Nair', 'Gupta', 'Iyer', 'Kapoor', 'Joshi',
  'Desai', 'Shah', 'Rao', 'Kulkarni', 'Patel', 'Singh', 'Reddy', 'Naidu',
];

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const pick = <T>(arr: readonly T[], i: number): T => arr[i % arr.length];

function buildFor(eventId: string, count: number, startOffset: number): Registration[] {
  const regs: Registration[] = [];
  for (let i = 0; i < count; i++) {
    const fn = pick(firstNames, i + startOffset);
    const ln = pick(lastNames, i * 2 + startOffset);
    const name = `${fn} ${ln}`;
    const slug = `${fn.toLowerCase()}.${ln.toLowerCase()}`;
    regs.push({
      id: `REG-${String(i + 1).padStart(3, '0')}-${eventId.slice(-3)}`,
      eventId,
      participantName: name,
      email: `${slug}@example.com`,
      phone: `+91 9${String(8000000000 + i * 137 + startOffset * 911).slice(0, 9)}`,
      department: pick(DEPARTMENTS, i + startOffset),
      year: pick(YEARS, i),
      registrationDate: iso(-((i % 20) + 1)),
      attendance: i % 7 === 0 ? 'Attended' : i % 11 === 0 ? 'Absent' : 'Registered',
    });
  }
  return regs;
}

export const seedRegistrations: Registration[] = [
  ...buildFor('evt-001', 18, 0),
  ...buildFor('evt-002', 22, 3),
  ...buildFor('evt-003', 14, 7),
  ...buildFor('evt-004', 12, 11),
  ...buildFor('evt-005', 8, 13),
  ...buildFor('evt-006', 16, 17),
  ...buildFor('evt-007', 20, 21),
  ...buildFor('evt-008', 15, 25),
  ...buildFor('evt-009', 18, 29),
  ...buildFor('evt-010', 6, 33),
  ...buildFor('evt-011', 12, 35),
  ...buildFor('evt-012', 9, 37),
  ...buildFor('evt-013', 20, 41),
  ...buildFor('evt-014', 14, 45),
  ...buildFor('evt-015', 10, 49),
  ...buildFor('evt-016', 16, 53),
  ...buildFor('evt-017', 22, 57),
  ...buildFor('evt-018', 12, 61),
  ...buildFor('evt-019', 8, 65),
];
