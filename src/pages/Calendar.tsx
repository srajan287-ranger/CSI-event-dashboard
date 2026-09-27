import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/context/EventsContext';
import { monthMatrix, formatDateShort } from '@/utils/eventUtils';
import { STATUS_COLORS, type Status } from '@/constants';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const { events } = useEvents();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : [];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const todayStr = now.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View all events scheduled across the year.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((d) => (
                <div key={d} className="py-1 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weeks.flat().map((date, i) => {
                if (!date) return <div key={i} className="aspect-square rounded-lg" />;
                const dateStr = date.toISOString().slice(0, 10);
                const dayEvents = eventsByDate.get(dateStr) ?? [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square rounded-lg border p-1 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : isToday
                        ? 'border-blue-300 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-500/5'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30'
                    }`}
                    aria-label={`${dateStr}: ${dayEvents.length} events`}
                  >
                    <span className={`text-xs font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span
                            key={e.id}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: STATUS_COLORS[e.status as Status] }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[8px] font-bold text-slate-400">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
              {(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'] as Status[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s] }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedDate ? formatDateShort(selectedDate) : 'Select a date'}
          </h3>
          {selectedDate ? (
            selectedEvents.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No events scheduled for this date.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {selectedEvents.map((e) => (
                  <Link
                    key={e.id}
                    to={`/events/${e.id}`}
                    className="block rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[e.status as Status] }} />
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {e.startTime} · {e.venue}
                    </p>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Click any date on the calendar to see events scheduled for that day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
