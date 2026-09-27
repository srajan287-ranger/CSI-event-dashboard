import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  CalendarRange,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { useEvents } from '@/context/EventsContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/registrations', label: 'Registrations', icon: Ticket },
  { to: '/calendar', label: 'Calendar', icon: CalendarRange },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { events, registrations } = useEvents();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <span className="text-sm font-bold">CS</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">CSI AITR</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Event Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick Stats</p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Events</span>
              <span className="font-bold text-slate-900 dark:text-white">{events.length}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Registrations</span>
              <span className="font-bold text-slate-900 dark:text-white">{registrations.length}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
