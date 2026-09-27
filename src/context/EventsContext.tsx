import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { EventItem, Registration } from '@/types';
import {
  loadEvents,
  saveEvents,
  loadRegistrations,
  saveRegistrations,
  loadSettings,
  saveSettings,
  type Settings,
} from '@/utils/storage';
import { refreshStatuses } from '@/utils/eventUtils';

interface EventsCtx {
  events: EventItem[];
  registrations: Registration[];
  settings: Settings;
  addEvent: (e: EventItem) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => EventItem | undefined;
  addRegistration: (r: Registration) => void;
  updateRegistration: (id: string, patch: Partial<Registration>) => void;
  getRegistrationsFor: (eventId: string) => Registration[];
  updateSettings: (patch: Partial<Settings>) => void;
}

const Ctx = createContext<EventsCtx | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(() => refreshStatuses(loadEvents()));
  const [registrations, setRegistrations] = useState<Registration[]>(() => loadRegistrations());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  useEffect(() => {
    saveEvents(events);
  }, [events]);
  useEffect(() => {
    saveRegistrations(registrations);
  }, [registrations]);
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const addEvent = useCallback((e: EventItem) => {
    setEvents((prev) => [e, ...prev]);
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== id));
  }, []);

  const getEvent = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  const addRegistration = useCallback((r: Registration) => {
    setRegistrations((prev) => [r, ...prev]);
  }, []);

  const updateRegistration = useCallback((id: string, patch: Partial<Registration>) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const getRegistrationsFor = useCallback(
    (eventId: string) => registrations.filter((r) => r.eventId === eventId),
    [registrations]
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<EventsCtx>(
    () => ({
      events,
      registrations,
      settings,
      addEvent,
      updateEvent,
      deleteEvent,
      getEvent,
      addRegistration,
      updateRegistration,
      getRegistrationsFor,
      updateSettings,
    }),
    [events, registrations, settings, addEvent, updateEvent, deleteEvent, getEvent, addRegistration, updateRegistration, getRegistrationsFor, updateSettings]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEvents() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
