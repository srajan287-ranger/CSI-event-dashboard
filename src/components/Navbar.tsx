import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useEvents } from '@/context/EventsContext';
import { formatDate } from '@/utils/eventUtils';

const dummyNotifications = [
  { id: 1, text: 'AI Workshop reaches 80% registration capacity.', time: '2h ago', type: 'warning' },
  { id: 2, text: 'CodeSprint Hackathon registration closes tomorrow.', time: '5h ago', type: 'warning' },
  { id: 3, text: 'New event added: Data Structures Masterclass.', time: '1d ago', type: 'info' },
  { id: 4, text: 'Git & GitHub Workshop starts today.', time: '1d ago', type: 'info' },
];

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const { settings } = useEvents();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/events?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const initials = settings.adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, speakers, venues..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
          aria-label="Search events"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 xl:block">{today}</span>

        <button
          onClick={toggle}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {settings.showNotifications && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif((s) => !s)}
              className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {dummyNotifications.map((n) => (
                    <div key={n.id} className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-700/50">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Profile menu"
          >
            {settings.adminAvatar ? (
              <img src={settings.adminAvatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {settings.adminName}
            </span>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{settings.adminName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{settings.adminEmail}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate('/settings');
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
