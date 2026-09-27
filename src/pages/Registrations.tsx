import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Ticket } from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import { useToast } from '@/context/ToastContext';
import RegistrationTable from '@/components/RegistrationTable';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/utils/eventUtils';
import type { AttendanceStatus } from '@/constants';

export default function Registrations() {
  const { id } = useParams<{ id: string }>();
  const { getEvent, getRegistrationsFor, registrations, updateRegistration } = useEvents();
  const { notify } = useToast();

  const event = id ? getEvent(id) : undefined;
  const regs = id ? getRegistrationsFor(id) : registrations;

  const handleUpdateAttendance = (regId: string, attendance: AttendanceStatus) => {
    updateRegistration(regId, { attendance });
    notify('Registration updated successfully.', 'success');
  };

  if (id && !event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Event Not Found</h2>
        <Link to="/events" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={event ? `/events/${event.id}` : '/events'}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {event ? `Registrations — ${event.name}` : 'All Registrations'}
          </h1>
          {event && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatDate(event.date)} · {event.venue}
            </p>
          )}
        </div>
      </div>

      {event && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <StatusBadge status={event.status} />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {event.registrations} / {event.capacity} registered
          </span>
        </div>
      )}

      {regs.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No participants have registered for this event."
          message="Registrations will appear here once participants sign up."
        />
      ) : (
        <RegistrationTable registrations={regs} onUpdateAttendance={handleUpdateAttendance} />
      )}
    </div>
  );
}
