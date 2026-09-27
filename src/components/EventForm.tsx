import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { EventItem } from '@/types';
import { CATEGORIES, STATUSES, type Category, type Status } from '@/constants';
import { validateEvent } from '@/utils/validation';
import { useToast } from '@/context/ToastContext';

type EventFormState = Partial<EventItem> & {
  speakerName?: string;
  speakerDesignation?: string;
  speakerOrganization?: string;
};

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventItem) => void;
  initial?: EventItem | null;
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function EventForm({ open, onClose, onSave, initial }: EventFormProps) {
  const { notify } = useToast();
  const [form, setForm] = useState<EventFormState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        speakerName: initial.speaker.name,
        speakerDesignation: initial.speaker.designation,
        speakerOrganization: initial.speaker.organization,
      });
    } else {
      setForm({
        name: '',
        description: '',
        category: 'Workshop' as Category,
        date: '',
        startTime: '10:00',
        endTime: '12:00',
        venue: '',
        speakerName: '',
        speakerDesignation: '',
        speakerOrganization: '',
        capacity: 100,
        registrations: 0,
        bannerUrl: '',
        registrationDeadline: '',
        status: 'Upcoming' as Status,
      });
    }
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, valid } = validateEvent(form);
    setErrors(errs as Record<string, string>);
    if (!valid) {
      notify('Please fix the errors in the form.', 'error');
      return;
    }
    const data: EventItem = {
      id: initial?.id ?? `evt-${Date.now()}`,
      name: form.name!,
      description: form.description ?? '',
      category: form.category as Category,
      date: form.date!,
      startTime: form.startTime!,
      endTime: form.endTime!,
      venue: form.venue!,
      speaker: {
        name: form.speakerName ?? '',
        designation: form.speakerDesignation ?? '',
        organization: form.speakerOrganization ?? '',
      },
      capacity: Number(form.capacity),
      registrations: Number(form.registrations ?? 0),
      bannerUrl:
        form.bannerUrl ||
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200',
      registrationDeadline: form.registrationDeadline!,
      status: form.status as Status,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {initial ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className={labelClass}>Event Name *</label>
            <input
              type="text"
              value={form.name ?? ''}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
              placeholder="e.g. AI & Cyber Security Workshop"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Brief description of the event..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={form.category ?? 'Workshop'}
                onChange={(e) => set('category', e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status ?? 'Upcoming'}
                onChange={(e) => set('status', e.target.value)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Date *</label>
              <input
                type="date"
                value={form.date ?? ''}
                onChange={(e) => set('date', e.target.value)}
                className={inputClass}
              />
              {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
            </div>
            <div>
              <label className={labelClass}>Start Time *</label>
              <input
                type="time"
                value={form.startTime ?? ''}
                onChange={(e) => set('startTime', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Time *</label>
              <input
                type="time"
                value={form.endTime ?? ''}
                onChange={(e) => set('endTime', e.target.value)}
                className={inputClass}
              />
              {errors.endTime && <p className="mt-1 text-xs text-rose-500">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Venue *</label>
            <input
              type="text"
              value={form.venue ?? ''}
              onChange={(e) => set('venue', e.target.value)}
              className={inputClass}
              placeholder="e.g. Seminar Hall A"
            />
            {errors.venue && <p className="mt-1 text-xs text-rose-500">{errors.venue}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Speaker Name</label>
              <input
                type="text"
                value={form.speakerName ?? ''}
                onChange={(e) => set('speakerName', e.target.value)}
                className={inputClass}
                placeholder="Dr. Rahul Sharma"
              />
            </div>
            <div>
              <label className={labelClass}>Designation</label>
              <input
                type="text"
                value={form.speakerDesignation ?? ''}
                onChange={(e) => set('speakerDesignation', e.target.value)}
                className={inputClass}
                placeholder="Professor"
              />
            </div>
            <div>
              <label className={labelClass}>Organization</label>
              <input
                type="text"
                value={form.speakerOrganization ?? ''}
                onChange={(e) => set('speakerOrganization', e.target.value)}
                className={inputClass}
                placeholder="IIT Bombay"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Capacity *</label>
              <input
                type="number"
                value={form.capacity ?? 0}
                onChange={(e) => set('capacity', Number(e.target.value))}
                className={inputClass}
                min={1}
              />
              {errors.capacity && <p className="mt-1 text-xs text-rose-500">{errors.capacity}</p>}
            </div>
            <div>
              <label className={labelClass}>Registrations</label>
              <input
                type="number"
                value={form.registrations ?? 0}
                onChange={(e) => set('registrations', Number(e.target.value))}
                className={inputClass}
                min={0}
              />
              {errors.registrations && <p className="mt-1 text-xs text-rose-500">{errors.registrations}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Registration Deadline *</label>
              <input
                type="date"
                value={form.registrationDeadline ?? ''}
                onChange={(e) => set('registrationDeadline', e.target.value)}
                className={inputClass}
              />
              {errors.registrationDeadline && (
                <p className="mt-1 text-xs text-rose-500">{errors.registrationDeadline}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Banner Image URL</label>
              <input
                type="url"
                value={form.bannerUrl ?? ''}
                onChange={(e) => set('bannerUrl', e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {initial ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
