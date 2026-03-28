# Cal.com Clone — Full-Stack Scheduling Platform

A production-ready scheduling and booking web application built as part of an SDE Intern assignment. Closely replicates Cal.com's UI/UX patterns, user flows, and interaction design.

---

## Live Demo

- **Frontend:** https://cal-com-clone-sandy.vercel.app
- **Backend API:** https://cal-com-clone-8qbm.onrender.com

---

## Screenshots

**Dashboard — Event Types**
![Dashboard](./assets/dashboard.png)

**Availability Settings**
![Availability](./assets/availability.png)

**Bookings Dashboard**
![Bookings](./assets/bookings.png)

**Public Booking Page**
![Public Booking](./assets/booking-page.png)

---

## Features

### Core
- **Event Types** — Create, edit, and delete meeting types with title, description, duration, and unique URL slug
- **Availability Settings** — Configure weekly recurring schedules per day with start/end times and timezone
- **Public Booking Page** — Shareable link with interactive calendar, real-time slot availability, and booking form
- **Double Booking Prevention** — Overlap detection on `startTime`/`endTime` before every booking is confirmed
- **Bookings Dashboard** — View upcoming and past bookings, soft-cancel without data loss

### Bonus
- Responsive design across mobile, tablet, and desktop
- Soft cancellation (status-based) preserving booking history
- Email notifications via emailService
- Seeded sample data for instant evaluation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + React Router |
| Styling | Raw CSS + Lucide Icons |
| Backend | Node.js + Express.js |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL (Neon DB) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure
```
calcom-clone/
├── backend/
│   ├── config/
│   │   └── db.js                  # Prisma client singleton
│   ├── controllers/
│   │   ├── availabilityController.js
│   │   ├── bookingController.js
│   │   └── eventController.js
│   ├── models/
│   │   ├── availability.model.js  # Zod schema
│   │   ├── booking.model.js       # Zod schema
│   │   └── eventType.model.js     # Zod schema
│   ├── routes/
│   │   ├── availabilityRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── eventRoutes.js
│   ├── services/
│   │   └── emailService.js        # Email notifications
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.js                # Sample data
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Availability.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── EventTypes.jsx
    │   │   └── PublicBooking.jsx
    │   ├── api.js                 # Centralized API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vercel.json
```

---

## Database Schema
```prisma
EventType    — id, title, description, duration, slug (unique)
Availability — id, dayOfWeek (unique), startTime, endTime, timezone
Booking      — id, eventTypeId (FK), name, email, date, startTime, endTime, status
```

**Key design decisions:**
- `@@unique([dayOfWeek])` on Availability — one schedule per day enforced at DB level
- `onDelete: Cascade` on Booking → EventType — bookings clean up when event type is deleted
- `status` field on Booking — soft cancellation preserves history instead of hard delete
- Overlap check queries only `confirmed` bookings — cancelled slots become available again

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/event-types` | List all event types |
| POST | `/api/event-types` | Create event type |
| PUT | `/api/event-types/:id` | Update event type |
| DELETE | `/api/event-types/:id` | Delete event type |
| GET | `/api/availability` | Get weekly schedule |
| PUT | `/api/availability` | Save weekly schedule |
| GET | `/api/availability/slots?date=&eventTypeId=` | Get free slots for a date |
| GET | `/api/bookings?filter=upcoming\|past` | List bookings |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Neon DB)

### 1. Clone the repo
```bash
git clone https://github.com/MrKhan092/Cal.com_Clone.git
cd Cal.com_Clone
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/calcom"
PORT=3001
```
```bash
npx prisma migrate dev --name init
node prisma/seed.js    # loads sample event types, availability, bookings
npm start              # http://localhost:3001
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

---

## Architecture Decisions

- **No authentication** — default user assumed logged in on admin side as per assignment requirements
- **MVC-inspired structure** — Controllers handle requests and DB logic, Models handle Zod validation, Routes handle URL mapping
- **try/catch in every controller** — consistent `{ error: "message" }` JSON responses, no global error middleware needed
- **Zod validation** — request body validated before hitting the database on every write operation
- **Prisma transactions** — availability updates use `$transaction` to atomically delete and recreate the full schedule
- **Soft deletes on bookings** — `status` field set to `cancelled` instead of hard delete, preserving booking history

---

## Assumptions

- Single user system — no multi-tenant or authentication support
- Availability is weekly recurring — no per-date overrides
- All times stored as strings `HH:MM` and dates as `YYYY-MM-DD`
- Slot computation is done server-side and only returns future available slots

---

## Author

**Mohammad Kaif**
[GitHub](https://github.com/MrKhan092) everything i s correct