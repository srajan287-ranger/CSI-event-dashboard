import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEvents } from '@/context/EventsContext';
import { CATEGORY_COLORS, STATUS_COLORS, type Status } from '@/constants';

export default function Analytics() {
  const { events } = useEvents();

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Upcoming: 0, Ongoing: 0, Completed: 0, Cancelled: 0 };
    events.forEach((e) => { counts[e.status] = (counts[e.status] ?? 0) + 1; });
    return (Object.keys(counts) as Status[]).map((k) => ({ name: k, value: counts[k], color: STATUS_COLORS[k] }));
  }, [events]);

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((e) => counts.set(e.category, (counts.get(e.category) ?? 0) + 1));
    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] ?? '#6b7280',
    }));
  }, [events]);

  const trendData = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.map((e) => ({
      name: e.name.length > 15 ? e.name.slice(0, 15) + '…' : e.name,
      registrations: e.registrations,
      capacity: e.capacity,
    }));
  }, [events]);

  const totalRegs = events.reduce((s, e) => s + e.registrations, 0);
  const avgFill = events.length
    ? Math.round(events.reduce((s, e) => s + (e.registrations / Math.max(e.capacity, 1)) * 100, 0) / events.length)
    : 0;

  const tooltipStyle = {
    backgroundColor: 'rgb(30 41 59)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Insights from {events.length} events and {totalRegs} total registrations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Registrations</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{totalRegs}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Fill Rate</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{avgFill}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Capacity</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {events.reduce((s, e) => s + e.capacity, 0)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Registration Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-20} textAnchor="end" height={60} interval={0} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="capacity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Event Status Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Event Category Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
