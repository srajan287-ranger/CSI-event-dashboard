import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Users,
  Pencil,
  Trash2,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import { useToast } from '@/context/ToastContext';
import StatusBadge from '@/components/StatusBadge';
import ProgressBar from '@/components/ProgressBar';
import EventForm from '@/components/EventForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate, formatTime, registrationPct, capacityLabel } from '@/utils/eventUtils';
import { CATEGORY_COLORS } from '@/constants';
import type { EventItem } from '@/types';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, updateEvent, deleteEvent, getRegistrationsFor } = useEvents();
  const { notify } = useToast();
  const event = id ? getEvent(id) : undefined;

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Event Not Found</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The event you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/events" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Back to Events
        </Link>
      </div>
    );
  }

  const regs = getRegistrationsFor(event.id);
  const pct = registrationPct(event);

  const handleSave = (data: EventItem) => {
    updateEvent(event.id, data);
    notify('Event updated successfully.', 'success');
    setFormOpen(false);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    notify('Event deleted successfully.', 'success');
    navigate('/events');
  };

  const infoItems = [
    { icon: Calendar, label: 'Date', value: formatDate(event.date) },
    { icon: Clock, label: 'Time', value: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
    { icon: MapPin, label: 'Venue', value: event.venue },
    { icon: User, label: 'Speaker', value: event.speaker.name },
    { icon: Building2, label: 'Organization', value: event.speaker.organization },
  ];

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link to="/events" className="hover:text-blue-600 dark:hover:text-blue-400">Events</Link>
        <span>/</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{event.name}</span>
      </nav>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="relative h-56 sm:h-72">
          <img src={event.bannerUrl} alt={event.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={event.status} />
              <span
                className="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: CATEGORY_COLORS[event.category] }}
              >
                {event.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">{event.name}</h1>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4" /> Edit Event
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" /> Delete Event
            </button>
            <Link
              to={`/events/${event.id}/registrations`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Ticket className="h-4 w-4" /> View Registrations
            </Link>
          </div>

          {event.description && (
            <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{event.description}</p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Speaker Designation</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.speaker.designation}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registration Summary</h3>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-slate-200 dark:border-slate-600">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{pct}%</p>
                </div>
              </div>
              <div className="flex-1">
                <ProgressBar event={event} />
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">{event.registrations} registered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">{event.capacity - event.registrations} spots left</span>
                  </div>
                  <span className={`font-semibold ${pct >= 90 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                    {capacityLabel(event)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">Registration Deadline: {formatDate(event.registrationDeadline)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{regs.length} registration records</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initial={event} />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
