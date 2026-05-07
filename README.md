# Ultima — Professional Sports Platform

Ultima is a state-of-the-art sports management and healthcare analytics platform. It provides a unified ecosystem for players, coaches, and club administrators, featuring real-time data synchronization, AI-powered insights, and a premium user experience.

## 🚀 Key Features

- **Multi-Role Dashboards**: Tailored experiences for Players, Coaches, Admins, and Super Admins.
- **Court Booking System**: Real-time court availability and reservation management.
- **Coach-Student Workflow**: Session scheduling, performance tracking, and roster management.
- **Live Match Control**: Real-time score updates and live match broadcasting via WebSockets.
- **AI Integration**:
  - **PersonaVision AI**: Advanced computer vision for biomechanical analysis.
  - **ALMUS**: Smart hydration dispenser station integration.
  - **SUMMA**: Comprehensive padel sports analytics dashboard.
- **Real-time Notifications**: Instant updates for bookings, feedback, and match events using Socket.io.

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Framer Motion (motion)
- **UI Components**: Radix UI, Lucide Icons
- **State/Auth**: Supabase Auth & DB
- **Real-time**: Socket.io-client

### Backend

- **Runtime**: Node.js with Express
- **Real-time**: Socket.io
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel ready

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Application

You can run both the frontend and backend concurrently:

```bash
npm run dev:all
```

Alternatively, run them separately:

- **Frontend**: `npm run dev` (starts on port 5173)
- **Backend**: `npm run dev:server` (starts on port 3002)

## 💡 Basic Usage Examples

### Booking a Court (Player Flow)

1. Navigate to the **"Book a Court"** section from the home page or dashboard.
2. Select a club and view available time slots.
3. Confirm your booking. You will receive a notification once the admin confirms.

### Scheduling a Session (Coach Flow)

1. Go to **"My Students"** to see your assigned players.
2. Navigate to **"Schedule"** and click on an available slot.
3. Assign a student and court, then save. The student will be notified instantly.

### Live Match Control (Admin Flow)

1. Open the **"Match Control"** dashboard.
2. Start a live match and update scores in real-time.
3. Scores are broadcasted to all connected clients viewing the live match page.

## 📄 License

This project is private and confidential. All rights reserved.
