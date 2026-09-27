import { useState } from 'react';
import { User, Mail, BarChart3, Bell, Palette, Save } from 'lucide-react';
import { useEvents } from '@/context/EventsContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function Settings() {
  const { settings, updateSettings } = useEvents();
  const { theme, setTheme } = useTheme();
  const { notify } = useToast();

  const [name, setName] = useState(settings.adminName);
  const [email, setEmail] = useState(settings.adminEmail);
  const [avatar, setAvatar] = useState(settings.adminAvatar);
  const [showAnalytics, setShowAnalytics] = useState(settings.showAnalytics);
  const [showNotifications, setShowNotifications] = useState(settings.showNotifications);

  const handleSave = () => {
    updateSettings({
      adminName: name,
      adminEmail: email,
      adminAvatar: avatar,
      showAnalytics,
      showNotifications,
      theme,
    });
    notify('Settings saved successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your profile and dashboard preferences.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Admin Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-10`} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Profile Image URL</label>
            <input type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Dashboard</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Show Analytics</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Display analytics on the dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics((s) => !s)}
              className={`relative h-6 w-11 rounded-full transition-colors ${showAnalytics ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={showAnalytics}
              aria-label="Toggle analytics"
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showAnalytics ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Show Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Display the notification bell</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications((s) => !s)}
              className={`relative h-6 w-11 rounded-full transition-colors ${showNotifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={showNotifications}
              aria-label="Toggle notifications"
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="text-lg">☀️</span> Light Mode
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="text-lg">🌙</span> Dark Mode
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
