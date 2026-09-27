import { useMemo, useState } from 'react';
import { Search, ArrowUpDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { Registration } from '@/types';
import { DEPARTMENTS, ATTENDANCE_STATUS, type AttendanceStatus } from '@/constants';
import { formatDateShort } from '@/utils/eventUtils';

const attendanceStyle: Record<AttendanceStatus, string> = {
  Registered: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Attended: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Absent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

const attendanceIcon = {
  Registered: Clock,
  Attended: CheckCircle2,
  Absent: XCircle,
};

export default function RegistrationTable({
  registrations,
  onUpdateAttendance,
}: {
  registrations: Registration[];
  onUpdateAttendance: (id: string, attendance: AttendanceStatus) => void;
}) {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [attendance, setAttendance] = useState('All');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name'>('date_desc');

  const filtered = useMemo(() => {
    let r = registrations;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (x) =>
          x.participantName.toLowerCase().includes(q) ||
          x.email.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q)
      );
    }
    if (dept !== 'All') r = r.filter((x) => x.department === dept);
    if (attendance !== 'All') r = r.filter((x) => x.attendance === attendance);
    const copy = [...r];
    if (sortBy === 'date_desc') copy.sort((a, b) => b.registrationDate.localeCompare(a.registrationDate));
    if (sortBy === 'date_asc') copy.sort((a, b) => a.registrationDate.localeCompare(b.registrationDate));
    if (sortBy === 'name') copy.sort((a, b) => a.participantName.localeCompare(b.participantName));
    return copy;
  }, [registrations, search, dept, attendance, sortBy]);

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass} aria-label="Filter by department">
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={attendance} onChange={(e) => setAttendance(e.target.value)} className={selectClass} aria-label="Filter by attendance">
          <option value="All">All Attendance</option>
          {ATTENDANCE_STATUS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className={selectClass} aria-label="Sort registrations">
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {registrations.length} participants
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
          <p className="text-sm text-slate-500 dark:text-slate-400">No participants match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-semibold">Reg ID</th>
                <th className="px-4 py-3 font-semibold">Participant</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Reg Date</th>
                <th className="px-4 py-3 font-semibold">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((r) => {
                const AIcon = attendanceIcon[r.attendance];
                return (
                  <tr key={r.id} className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/30">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{r.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{r.participantName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{r.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.department}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.year}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">{formatDateShort(r.registrationDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${attendanceStyle[r.attendance]}`}>
                          <AIcon className="h-3 w-3" />
                          {r.attendance}
                        </span>
                      </div>
                      <select
                        value={r.attendance}
                        onChange={(e) => onUpdateAttendance(r.id, e.target.value as AttendanceStatus)}
                        className="mt-1 rounded border border-slate-200 bg-transparent px-1.5 py-0.5 text-xs text-slate-600 focus:outline-none dark:border-slate-600 dark:text-slate-300"
                        aria-label={`Change attendance for ${r.participantName}`}
                      >
                        {ATTENDANCE_STATUS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
