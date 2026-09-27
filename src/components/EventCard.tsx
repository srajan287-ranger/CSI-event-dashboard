import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Calendar, Clock, MapPin, User } from 'lucide-react';
import type { EventItem } from '@/types';
import { CATEGORY_COLORS } from '@/constants';
import { formatDate, formatTime } from '@/utils/eventUtils';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

interface EventCardProps {
  event: EventItem;
  onEdit: (e: EventItem) => void;
  onDelete: (e: EventItem) => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <span
            className="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: CATEGORY_COLORS[event.category] }}
          >
            {event.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-white">{event.name}</h3>

        <div className="mt-3 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.speaker.name}, {event.speaker.designation}</span>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar event={event} />
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
          <Link
            to={`/events/${event.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" /> View
          </Link>
          <button
            onClick={() => onEdit(event)}
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Edit event"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(event)}
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:border-slate-600 dark:hover:bg-rose-500/10"
            aria-label="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
