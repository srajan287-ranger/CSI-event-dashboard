import { registrationPct, capacityLabel } from '@/utils/eventUtils';
import type { EventItem } from '@/types';

export default function ProgressBar({ event }: { event: EventItem }) {
  const pct = registrationPct(event);
  const barColor =
    pct >= 100 ? 'bg-rose-500' : pct >= 90 ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {event.registrations} / {event.capacity} registered
        </span>
        <span
          className={`font-semibold ${
            pct >= 90 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {capacityLabel(event)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
