# Cal.com Clone

A full-stack scheduling and booking web application inspired by Cal.com. 

## Features
- **Event Types Management**: Create and manage customizable event types with unique public URLs.
- **Availability Settings**: Set weekly recurring schedules and active hours.
- **Public Booking Page**: Shareable link where visitors can pick a date on a dynamic calendar, select from available time slots (checked against existing bookings to prevent double-booking), and schedule meetings.
- **Dashboard**: Track upcoming appointments and safely soft-cancel bookings.

## Tech Stack
- **Frontend**: React.js configured with Vite, standard `react-router-dom`, customized minimalist UI utilizing raw CSS and Lucide icons.
- **Backend**: Node.js + Express.js, following an MVC-inspired architecture with separated Controllers, Services, and Routes.
- **Database**: PostgreSQL paired with Prisma ORM.

## Project Structure
- `/frontend` - Vite React App
- `/backend` - Express.js API + Prisma Schema

## Setup Instructions

### Environment Variables
1. Navigate to the `backend` directory.
2. Edit the `.env` file to include your PostgreSQL connection (already done using Neon DB):
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_.../neondb?sslmode=require"
   PORT=3001
   ```

### 1. Start the Backend
```bash
cd backend
npm install
npx prisma db push
npm run seed  # (Optional) Seed the DB with examples
npm start     # Runs on http://localhost:3001
```

### 2. Start the Frontend
In a separate terminal block:
```bash
cd frontend
npm install
npm run dev   # Runs on http://localhost:5173
```

## Database Architecture
- **EventType**: Stores different meeting profiles (`title`, `slug`, `duration`).
- **Availability**: Stores a unified weekly schedule logic outlining allowed ranges per `dayOfWeek`.
- **Booking**: Links to `EventType`. Stores the user details and prevents overlaps globally via dynamic overlap-checking logic on the `startTime` and `endTime` fields. Contains a `status` field for tracking soft-cancellations.
