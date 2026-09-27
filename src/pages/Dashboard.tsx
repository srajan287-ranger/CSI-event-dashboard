import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CalendarClock,
  Ticket,
  CheckCircle2,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import StatCard from '@/components/StatCard';
import EventCard from '@/components/EventCard';
import EventForm from '@/components/EventForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { EventCardSkeleton, useLoadingDelay } from '@/components/Skeleton';
import { useToast } from '@/context/ToastContext';
import type { EventItem } from '@/types';

export default function Dashboard() {
  const { events, addEvent, updateEvent, deleteEvent, settings } = useEvents();
  const { notify } = useToast();
  const loading = useLoadingDelay(600);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EventItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter((e) => e.status === 'Upcoming').length;
    const completed = events.filter((e) => e.status === 'Completed').length;
    const totalRegs = events.reduce((sum, e) => sum + e.registrations, 0);
    return { total, upcoming, completed, totalRegs };
  }, [events]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => e.status === 'Upcoming' || e.status === 'Ongoing')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6),
    [events]
  );

  const recentCompleted = useMemo(
    () => events.filter((e) => e.status === 'Completed').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [events]
  );

  const handleSave = (data: EventItem) => {
    if (editTarget) {
      updateEvent(editTarget.id, data);
      notify('Event updated successfully.', 'success');
    } else {
      addEvent(data);
      notify('Event created successfully.', 'success');
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEvent(deleteTarget.id);
      notify('Event deleted successfully.', 'success');
      setDeleteTarget(null);
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting}, {settings.adminName.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening with CSI AITR events.
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total Events" value={stats.total} trend={`${stats.total} events managed`} color="blue" />
          <StatCard icon={CalendarClock} label="Upcoming Events" value={stats.upcoming} trend="Scheduled ahead" trendUp color="amber" />
          <StatCard icon={Ticket} label="Total Registrations" value={stats.totalRegs} trend="Across all events" trendUp color="violet" />
          <StatCard icon={CheckCircle2} label="Completed Events" value={stats.completed} trend="Successfully concluded" color="emerald" />
        </div>
      )}

      {settings.showAnalytics && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Registration Trend</h2>
            <Link to="/analytics" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View Analytics <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-end gap-2">
            {events.slice(0, 8).map((e) => {
              const h = Math.max(8, Math.round((e.registrations / Math.max(...events.map((x) => x.capacity))) * 120));
              return (
                <div key={e.id} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-blue-500 to-indigo-500 transition-all hover:from-blue-600 hover:to-indigo-600"
                      style={{ height: `${h}px` }}
                      title={`${e.name}: ${e.registrations}`}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[10px] text-slate-400" title={e.name}>
                    {e.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming & Ongoing Events</h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nothing scheduled yet."
            message="There are no upcoming events. Create one to get started."
            actionLabel="Add Event"
            onAction={() => setFormOpen(true)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} onEdit={(ev) => { setEditTarget(ev); setFormOpen(true); }} onDelete={(ev) => setDeleteTarget(ev)} />
            ))}
          </div>
        )}
      </div>

      {recentCompleted.length > 0 && !loading && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recently Completed</h2>
          <div className="space-y-2">
            {recentCompleted.map((e) => (
              <Link
                key={e.id}
                to={`/events/${e.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{e.date} · {e.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="hidden sm:inline">{e.registrations} registrations</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <EventForm open={formOpen} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} initial={editTarget} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
