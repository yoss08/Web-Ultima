# Notification System - Visual Flow Diagrams

## 1. COACH-PLAYER NOTIFICATIONS

### Flow: Coach Assigns Player
```
Admin/Coach Panel
    ↓
    [Assign Player to Coach Button]
    ↓
    POST /api/coach/students
    {coachId, studentId}
    ↓
    Backend:
    ├─ Insert coach_students row
    ├─ Query coach profile (get coach name)
    └─ Insert notification:
       {
         user_id: studentId,
         type: 'student_assignment',
         message: 'You are assigned to coach [Name]',
         related_entity_id: coachId,
         related_entity_type: 'coach'
       }
    ↓
    ✅ Player sees: "You are assigned to coach [Name]"
```

### Flow: Coach Schedules Training Session
```
Coach Dashboard
    ↓
    [Schedule Training Button]
    ↓
    SessionScheduler Component
    ↓
    POST /api/coach/sessions
    {coach_id, student_id, start_time, ...}
    ↓
    Backend:
    ├─ Insert training_sessions row
    ├─ Get session ID
    ├─ Query coach profile (get coach name)
    ├─ Format date/time
    └─ Insert notification:
       {
         user_id: student_id,
         type: 'training_session',
         message: 'Coach [Name] scheduled session [Date] [Time]',
         related_entity_id: session_id,
         related_entity_type: 'training_session'
       }
    ↓
    ✅ Player sees: "Coach [Name] scheduled a training session on [Date] at [Time]"
```

### Flow: Coach Adds Feedback
```
StudentDetails Component
    ↓
    [Submit Feedback Button]
    ↓
    Frontend:
    ├─ Insert coach_feedbacks row
    ├─ Socket.io emit real-time notification
    └─ Insert notification:
       {
         user_id: student_id,
         type: 'coach_feedback',
         message: 'Coach [Name] added feedback',
         related_entity_id: feedback_id,
         related_entity_type: 'feedback'
       }
    ↓
    ✅ Player sees: "Coach [Name] has added new feedback for you"
```

---

## 2. ADMIN NOTIFICATIONS

### Flow: Admin Adds Court
```
CourtsManagementPage
    ↓
    [Add Court Button]
    ↓
    POST /api/admin/courts
    {name, type, surface, capacity}
    ↓
    Backend:
    ├─ Insert courts row
    ├─ Get court ID
    ├─ Query ALL super_admins
    └─ For each super_admin:
       Insert notification:
       {
         user_id: super_admin_id,
         type: 'admin_added_court',
         message: 'Admin added court "[Name]" to their club',
         related_entity_id: court_id,
         related_entity_type: 'court'
       }
    ↓
    ✅ Super Admin sees: "Admin added a new court [Name] to their club"
```

### Flow: Admin Publishes Competition
```
AdminCompetitionsPage
    ↓
    [Publish Competition Button]
    ↓
    POST /api/admin/competitions
    {name, date, description, ...}
    ↓
    Backend:
    ├─ Insert tournaments row
    ├─ Get tournament ID
    │
    ├─ Query ALL super_admins
    │  └─ Insert for each:
    │     {
    │       type: 'admin_published_competition',
    │       message: 'Admin published competition [Name]',
    │       related_entity_id: tournament_id
    │     }
    │
    └─ Query ALL players in club
       └─ Insert for each:
          {
            type: 'competition_published',
            message: 'New competition "[Name]" available. Register now!',
            related_entity_id: tournament_id
          }
    ↓
    ✅ Super Admin sees: "Admin published competition [Name]"
    ✅ Players see: "New competition [Name] - Register now!"
```

### Flow: Admin Updates Booking Status
```
AdminBookingsPage
    ↓
    [Accept/Decline Booking Button]
    ↓
    PUT /api/admin/bookings/:id
    {status: 'accepted' | 'declined'}
    ↓
    Backend:
    ├─ Update bookings table
    └─ If status changed:
       Insert notification:
       {
         user_id: booking.user_id,
         type: 'booking_update',
         message: 'Your booking [...] has been [ACCEPTED/DECLINED]',
         related_entity_id: booking_id,
         related_entity_type: 'booking'
       }
    ↓
    ✅ Player sees: "Your booking for [Date] at [Time] has been ACCEPTED"
       (ONLY this player sees it - RLS enforced)
```

---

## 3. NOTIFICATION VISIBILITY (RLS Policies)

```
┌─────────────────────────────────────────────────────────────┐
│                    NOTIFICATION TABLE                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ id | user_id | type | message | related_entity_id | ... │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┬────────────────────────────────────┐
│      WHO CAN SEE        │         RLS CONDITION              │
├─────────────────────────┼────────────────────────────────────┤
│ Player (own notifs)     │ auth.uid() = user_id               │
│ Coach (own notifs)      │ auth.uid() = user_id               │
│ Admin (own notifs)      │ auth.uid() = user_id               │
│ Admin (booking notifs)  │ BLOCKED via RLS                    │
│ Super Admin (admin      │ type IN (admin_* OR *activity)     │
│             activity)   │ AND role = super_admin             │
└─────────────────────────┴────────────────────────────────────┘
```

---

## 4. DATA ACCESS HIERARCHY (RLS)

### Players
```
Can see:
├─ Own profile
└─ Own notifications:
   ├─ assignment notifications
   ├─ training session notifications
   ├─ feedback notifications
   ├─ booking status updates
   └─ competition announcements

Cannot see:
├─ Other players' profiles
├─ Other players' notifications
├─ Admin activity notifications
└─ Booking details for other players
```

### Coaches
```
Can see:
├─ Own profile
├─ ALL players in their club (RLS: "Coaches can see club members")
├─ All coach_students relationships
├─ Own training sessions
├─ Own feedbacks
└─ Own notifications

Can do:
├─ Assign themselves to ANY player in club
├─ Schedule sessions for ANY player in club
└─ Add feedback for ANY player in club

Cannot see:
├─ Players from other clubs
├─ Bookings (admin only)
├─ Admin activity notifications
└─ Other coaches' work
```

### Admins
```
Can see:
├─ All club members (role = admin, coach, player)
├─ All club bookings
├─ All club courts
├─ All club competitions
└─ Own notifications

Can do:
├─ Accept/decline bookings
├─ Add courts (triggers super admin notification)
├─ Publish competitions (triggers notifications)
├─ Manage coaches/players
└─ View booking notifications

Cannot see:
├─ Other clubs' data
└─ Admin activity notifications (only super admin sees those)
```

### Super Admins
```
Can see:
├─ All clubs
├─ All users
├─ All bookings (all clubs)
├─ All competitions (all clubs)
├─ Admin activity notifications:
│  ├─ admin_added_court
│  ├─ admin_published_competition
│  └─ admin_activity
└─ Own notifications

Can do:
├─ Update any profile
├─ Manage all clubs
├─ View global analytics
└─ Monitor admin activities
```

---

## 5. NOTIFICATION TYPE CLASSIFICATION

### SYSTEM-GENERATED (Backend creates)
| Type | Trigger | Recipient | Visible To |
|------|---------|-----------|-----------|
| `student_assignment` | Coach assigned | Player | Player only |
| `training_session` | Session scheduled | Player | Player only |
| `booking_update` | Booking status changed | Player | Player only |
| `admin_added_court` | Court created | Super Admin | Super Admin only |
| `admin_published_competition` | Competition published | Super Admin | Super Admin only |
| `competition_published` | Competition published | Player | Player only |

### FRONTEND-GENERATED (Component creates)
| Type | Trigger | Recipient | Visible To |
|------|---------|-----------|-----------|
| `coach_feedback` | Feedback submitted | Player | Player only |

---

## 6. NOTIFICATION FLOW TIMING

```
┌─────────────────────────────────────────────────────────┐
│           WHAT HAPPENS WHEN ACTIONS OCCUR                │
└─────────────────────────────────────────────────────────┘

IMMEDIATELY:
├─ Coach assigns player
│  └─ Notification inserted to DB
│     └─ Player sees via real-time subscription OR next refresh
│
├─ Coach schedules session
│  └─ Notification inserted to DB + Socket.io emit
│     └─ Player sees in real-time OR next refresh
│
├─ Admin adds court
│  └─ Notification inserted for ALL super admins
│     └─ Super admins see in real-time OR next refresh
│
└─ Admin publishes competition
   └─ Notifications inserted for ALL super admins + ALL players in club
      └─ All recipients see in real-time OR next refresh

DELAY (Frontend operation):
└─ Coach adds feedback
   └─ Frontend inserts to DB
      └─ Player sees via refresh (Socket.io also emits for real-time)
```

---

## 7. COMPLETE REQUEST/RESPONSE EXAMPLE

### Request: Assign Player to Coach
```javascript
POST /api/coach/students

Request Body:
{
  "coachId": "uuid-coach-123",
  "studentId": "uuid-student-456"
}

Response:
{
  "id": "uuid-assignment-789",
  "coach_id": "uuid-coach-123",
  "student_id": "uuid-student-456",
  "assigned_at": "2026-04-25T10:30:00Z"
}

Side Effect - Notification Created:
{
  "id": "uuid-notif-001",
  "user_id": "uuid-student-456",
  "type": "student_assignment",
  "message": "You are now assigned to coach John Smith",
  "related_entity_id": "uuid-coach-123",
  "related_entity_type": "coach",
  "read": false,
  "created_at": "2026-04-25T10:30:00Z"
}
```

### Response: Get Player Notifications
```javascript
GET /api/notifications

Response (via RLS - only own notifications):
[
  {
    "id": "uuid-notif-001",
    "user_id": "uuid-student-456",
    "type": "student_assignment",
    "message": "You are now assigned to coach John Smith",
    "related_entity_id": "uuid-coach-123",
    "related_entity_type": "coach",
    "read": false,
    "created_at": "2026-04-25T10:30:00Z"
  },
  {
    "id": "uuid-notif-002",
    "user_id": "uuid-student-456",
    "type": "training_session",
    "message": "Coach John Smith scheduled a training session on Apr 26 at 10:00 AM",
    "related_entity_id": "uuid-session-789",
    "related_entity_type": "training_session",
    "read": false,
    "created_at": "2026-04-25T10:35:00Z"
  }
]
```

---

## 8. KEY IMPLEMENTATION FEATURES

✅ **Role-Based Visibility** - RLS ensures right people see right notifications
✅ **Entity Tracking** - related_entity_id allows deep linking to source
✅ **Type Categorization** - Type field enables filtering/categorization  
✅ **Audit Trail** - created_at timestamp for activity logging
✅ **Read Status** - Track which notifications user has seen
✅ **No Data Leakage** - Booking notifications completely isolated
✅ **Scalable** - Works for N super admins, N clubs, N players
