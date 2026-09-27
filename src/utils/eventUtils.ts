import type { EventItem } from '@/types';
import type { Status } from '@/constants';

export function computeStatus(event: EventItem): Status {
  if (event.status === 'Cancelled') return 'Cancelled';
  const now = new Date();
  const start = new Date(`${event.date}T${event.startTime}`);
  const end = new Date(`${event.date}T${event.endTime}`);
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Ongoing';
  return 'Completed';
}

export function refreshStatuses(events: EventItem[]): EventItem[] {
  return events.map((e) => {
    if (e.status === 'Cancelled') return e;
    const computed = computeStatus(e);
    return computed === e.status ? e : { ...e, status: computed };
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

export function registrationPct(event: EventItem): number {
  if (event.capacity <= 0) return 0;
  return Math.min(100, Math.round((event.registrations / event.capacity) * 100));
}

export function capacityLabel(event: EventItem): string {
  const pct = registrationPct(event);
  if (pct >= 100) return 'Full';
  if (pct >= 90) return 'Almost Full';
  return `${pct}% filled`;
}

export function isToday(iso: string): boolean {
  const t = new Date();
  const d = new Date(iso + 'T00:00:00');
  return t.toDateString() === d.toDateString();
}

export function isThisWeek(iso: string): boolean {
  const d = new Date(iso + 'T00:00:00');
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return d >= start && d <= end;
}

export function isThisMonth(iso: string): boolean {
  const d = new Date(iso + 'T00:00:00');
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function sortEvents(
  events: EventItem[],
  sort: 'newest' | 'oldest' | 'registrations' | 'capacity' | 'name'
): EventItem[] {
  const copy = [...events];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.date.localeCompare(a.date));
    case 'oldest':
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case 'registrations':
      return copy.sort((a, b) => b.registrations - a.registrations);
    case 'capacity':
      return copy.sort((a, b) => b.capacity - a.capacity);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

export function monthMatrix(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
