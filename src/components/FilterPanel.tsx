import { CATEGORIES, STATUSES } from '@/constants';

export interface Filters {
  status: string;
  category: string;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  sort: 'newest' | 'oldest' | 'registrations' | 'capacity' | 'name';
}

export const defaultFilters: Filters = {
  status: 'All',
  category: 'All',
  dateFilter: 'all',
  sort: 'newest',
};

export default function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className={selectClass}
          aria-label="Filter by category"
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Date</label>
        <select
          value={filters.dateFilter}
          onChange={(e) => onChange({ dateFilter: e.target.value as Filters['dateFilter'] })}
          className={selectClass}
          aria-label="Filter by date"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sort</label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as Filters['sort'] })}
          className={selectClass}
          aria-label="Sort events"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="registrations">Most Registered</option>
          <option value="capacity">Largest Capacity</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
