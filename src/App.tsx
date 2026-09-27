import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { EventsProvider } from '@/context/EventsContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import Events from '@/pages/Events';
import EventDetails from '@/pages/EventDetails';
import Registrations from '@/pages/Registrations';
import Calendar from '@/pages/Calendar';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div key={location.pathname} className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/registrations" element={<Registrations />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <EventsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </EventsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
