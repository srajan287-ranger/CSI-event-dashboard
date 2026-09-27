# CSI AITR Event Management Dashboard

## Overview

A complete, polished, responsive web application for managing college events for the Computer Society of India (CSI) student chapter at AITR. Built as a functional frontend prototype — no backend required. All data persists in the browser via LocalStorage, so everything survives a page refresh.

## Features

- **Dashboard Home** — Personalized greeting, live statistics cards (total events, upcoming, registrations, completed), registration trend mini-chart, and quick-glance upcoming & recently-completed sections.
- **Event CRUD** — Create, edit, and delete events with a full-featured modal form. Validation for all required fields, capacity, and time ranges. Delete confirmation dialog prevents accidental data loss.
- **Event Details Page** — Large banner, full event info, speaker details, registration summary with circular progress indicator, and quick action buttons.
- **Registration Management** — Per-event and global registration tables with search, department filter, attendance filter, and sorting. Inline attendance status updates (Registered / Attended / Absent).
- **Search** — Global event search by name, speaker, venue, or category. Instant results with clear-search.
- **Filters** — Filter by status, category, and date (today / this week / this month). Filters combine with sorting.
- **Sorting** — Sort by newest, oldest, registration count, capacity, or name.
- **Registration Progress** — Visual progress bar on every event card with "Almost Full" (90%+) and "Full" (100%) indicators.
- **Calendar** — Monthly calendar view with color-coded event dots. Click any date to see events scheduled for that day.
- **Analytics** — Interactive charts powered by Recharts: registration trend (line), event status distribution (donut), and category distribution (horizontal bar). Charts update automatically from stored data.
- **Notifications** — Dropdown bell with event-based notifications.
- **Settings** — Editable admin profile, toggle analytics/notifications, and a working light/dark mode toggle.
- **Dark Mode** — Full dark theme with system-persistent preference.
- **LocalStorage Persistence** — Events, registrations, theme, and settings all survive page refreshes.
- **Responsive Design** — Works from 320px mobile up to large desktop. Sidebar collapses to a hamburger slide-out on tablet/mobile.
- **Empty States** — Polished empty states with icons and action buttons for no events, no search results, and no registrations.
- **Loading States** — Skeleton loaders simulate data fetching on dashboard and event lists.
- **Toast Notifications** — Reusable success/error/warning/info toasts for all CRUD actions.
- **404 Page** — Custom not-found page for invalid routes.
- **Accessibility** — Semantic HTML, ARIA labels, keyboard-navigable controls, visible focus states, and status indicators that don't rely on color alone.

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool and dev server
- **TypeScript** — Type safety
- **Tailwind CSS 3** — Styling with dark mode via `class` strategy
- **React Router 7** — Client-side routing
- **Recharts 3** — Charts and analytics
- **Lucide React** — Icons
- **LocalStorage** — Data persistence (no backend)

## Project Structure

```
src/
├── components/
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   ├── FilterPanel.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   ├── RegistrationTable.tsx
│   ├── SearchBar.tsx
│   ├── Sidebar.tsx
│   ├── Skeleton.tsx
│   ├── StatCard.tsx
│   └── StatusBadge.tsx
├── context/
│   ├── EventsContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── data/
│   ├── events.ts
│   └── registrations.ts
├── pages/
│   ├── Analytics.tsx
│   ├── Calendar.tsx
│   ├── Dashboard.tsx
│   ├── EventDetails.tsx
│   ├── Events.tsx
│   ├── NotFound.tsx
│   ├── Registrations.tsx
│   └── Settings.tsx
├── utils/
│   ├── eventUtils.ts
│   ├── storage.ts
│   └── validation.ts
├── App.tsx
├── constants.ts
├── index.css
├── main.tsx
└── types.ts
```

## Installation

```bash
npm install
npm run dev
```

The app runs on the Vite dev server (default: `http://localhost:5173`).

## Build

```bash
npm run build
```

This produces a production bundle in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

### Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel auto-detects Vite — set the build command to `npm run build` and output directory to `dist`.
4. Deploy. No environment variables required.

### Netlify

1. Push this repository to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) and create a new site from the repo.
3. Set build command to `npm run build` and publish directory to `dist`.
4. Add a redirect rule in `netlify.toml` or `_redirects` so client-side routing works:

   ```
   /*  /index.html  200
   ```

5. Deploy. No environment variables required.

## Features Implemented

- Event CRUD (create, read, update, delete)
- Search by name, speaker, venue, category
- Filtering by status, category, and date range
- Sorting by date, registrations, capacity, and name
- Registration management with attendance tracking
- Registration progress bars with capacity indicators
- Analytics with interactive charts (line, donut, bar)
- Monthly calendar with event indicators
- LocalStorage persistence for all data
- Responsive design (320px to 1440px+)
- Dark mode with persistent preference
- Toast notifications
- Loading skeletons
- Empty states
- 404 page
- Accessible controls and ARIA labels

## Screenshots

_Add screenshots here after running the app._

## Future Improvements

- Real backend with a database (e.g., Supabase or PostgreSQL)
- User authentication and role-based access (admin vs. student)
- Email notifications for registration confirmations and reminders
- QR code-based attendance tracking
- Real-time registration updates via WebSockets
- Export registrations to CSV/PDF
- Multi-admin support with event ownership
- Public-facing event registration page for students
