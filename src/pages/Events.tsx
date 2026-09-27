import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, CalendarX, Search } from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import { useToast } from '@/context/ToastContext';
import EventCard from '@/components/EventCard';
import EventForm from '@/components/EventForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import SearchBar, { useUrlSearch } from '@/components/SearchBar';
import FilterPanel, { defaultFilters, type Filters } from '@/components/FilterPanel';
import { EventCardSkeleton, useLoadingDelay } from '@/components/Skeleton';
import { sortEvents, isToday, isThisWeek, isThisMonth } from '@/utils/eventUtils';
import type { EventItem } from '@/types';

export default function Events() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { notify } = useToast();
  const loading = useLoadingDelay(500);
  const [urlQ, setUrlQ] = useUrlSearch();
  const [localQ, setLocalQ] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EventItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  const search = urlQ || localQ;
  const setSearch = (v: string) => {
    setLocalQ(v);
    setUrlQ(v);
  };

  const filtered = useMemo(() => {
    let result = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.speaker.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    if (filters.status !== 'All') result = result.filter((e) => e.status === filters.status);
    if (filters.category !== 'All') result = result.filter((e) => e.category === filters.category);
    if (filters.dateFilter === 'today') result = result.filter((e) => isToday(e.date));
    if (filters.dateFilter === 'week') result = result.filter((e) => isThisWeek(e.date));
    if (filters.dateFilter === 'month') result = result.filter((e) => isThisMonth(e.date));
    return sortEvents(result, filters.sort);
  }, [events, search, filters]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage all CSI AITR events — {events.length} total
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, speaker, venue, category..." />
      </div>

      <FilterPanel filters={filters} onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5].map((i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={search ? Search : CalendarX}
          title={search ? 'No events match your search.' : 'No events found.'}
          message={search ? 'Try adjusting your search or filters.' : 'There are no events matching the selected filters.'}
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setFilters(defaultFilters); }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onEdit={(ev) => { setEditTarget(ev); setFormOpen(true); }}
              onDelete={(ev) => setDeleteTarget(ev)}
            />
          ))}
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
