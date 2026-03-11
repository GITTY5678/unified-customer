# NexusDesk Frontend

React + Vite frontend for NexusDesk support platform.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (make sure backend is running on :8000)
npm run dev
```

Open: http://localhost:5173

Login with: `admin@nexusdesk.in` / `nexusdesk123`

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Login screen |
| `/dashboard` | Stats overview + recent tickets |
| `/tickets` | Full ticket list with filters |
| `/tickets/:id` | Ticket detail + conversation + AI summary |
| `/customers` | Customer list + add customer |
| `/settings` | Account & API info |

## API Proxy

Vite proxies `/api/*` → `http://127.0.0.1:8000/*`
So `api.get('/tickets/')` hits `http://127.0.0.1:8000/tickets/`

## Tech Stack

- React 18 + Vite
- React Router v6
- Axios (with JWT interceptor)
- Lucide React icons
- DM Sans + DM Mono fonts (Google Fonts)
- Pure CSS-in-JS (no Tailwind/MUI dependency)

## Project Structure

```
src/
  App.jsx                    # Routes
  main.jsx                   # Entry point
  index.css                  # Global design tokens (CSS vars)
  context/
    AuthContext.jsx           # JWT auth state
  services/
    api.js                    # Axios instance
  components/
    ProtectedRoute.jsx
    layout/
      AppLayout.jsx           # Sidebar + outlet
      Sidebar.jsx
    ui/
      Badge.jsx               # Status/priority badges
      PageHeader.jsx
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    TicketsPage.jsx
    TicketDetailPage.jsx      # Has AI summary button
    CustomersPage.jsx
    SettingsPage.jsx
```
