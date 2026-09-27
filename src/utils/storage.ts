import type { EventItem, Registration } from '@/types';
import { seedEvents } from '@/data/events';
import { seedRegistrations } from '@/data/registrations';

const EVENTS_KEY = 'csi_events';
const REGS_KEY = 'csi_registrations';
const THEME_KEY = 'csi_theme';
const SETTINGS_KEY = 'csi_settings';

export function loadEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(seedEvents));
      return seedEvents;
    }
    return JSON.parse(raw) as EventItem[];
  } catch {
    return seedEvents;
  }
}

export function saveEvents(events: EventItem[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function loadRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(REGS_KEY);
    if (!raw) {
      localStorage.setItem(REGS_KEY, JSON.stringify(seedRegistrations));
      return seedRegistrations;
    }
    return JSON.parse(raw) as Registration[];
  } catch {
    return seedRegistrations;
  }
}

export function saveRegistrations(regs: Registration[]): void {
  localStorage.setItem(REGS_KEY, JSON.stringify(regs));
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export interface Settings {
  adminName: string;
  adminEmail: string;
  adminAvatar: string;
  showAnalytics: boolean;
  showNotifications: boolean;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  adminName: 'Admin User',
  adminEmail: 'admin@csiaitr.edu',
  adminAvatar: '',
  showAnalytics: true,
  showNotifications: true,
  theme: 'light',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
