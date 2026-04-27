# Notification System - Deployment Guide

## 🚀 Quick Start (What You Need to Do)

### Step 1: Run Database Migration
**Location:** Supabase SQL Editor  
**File:** `supabase/migrations/20260425_enhanced_notifications.sql`

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20260425_enhanced_notifications.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message

**What this does:**
- Adds new columns to notifications table for better tracking
- Creates comprehensive RLS policies for all roles
- Enables coaches to see all club players
- Enables admins to see booking notifications
- Enables super admins to see admin activity

### Step 2: Verify Backend is Running
The following files already contain the necessary notification logic:
- ✅ `server/routes/coachRoutes.js` - Coach notifications
- ✅ `server/routes/adminRoutes.js` - Admin notifications  
- ✅ `src/screens/coach/StudentDetails.tsx` - Feedback notifications

No changes needed - they're already implemented.

### Step 3: Test the System

#### Test 1: Coach Assigns Player
1. Login as Admin
2. Go to Admin Management page
3. Assign a player to a coach
4. Login as Player
5. Check notifications - should see "You are now assigned to coach [Name]"
✅ **Expected:** "You are assigned to coach..." notification appears

#### Test 2: Coach Schedules Training
1. Login as Coach
2. Go to Schedule Training page
3. Select student, date, time
4. Submit
5. Login as Player
6. Check notifications
✅ **Expected:** "Coach... scheduled a training session on [Date] at [Time]" notification appears

#### Test 3: Coach Adds Feedback
1. Login as Coach
2. Go to Student Details
3. Scroll to feedback section
4. Add feedback/rating
5. Click Submit
6. Login as Player
7. Check notifications
✅ **Expected:** "Coach... has added new feedback" notification appears

#### Test 4: Admin Adds Court
1. Login as Admin
2. Go to Courts Management
3. Add a new court
4. Login as Super Admin (create one if needed)
5. Check notifications
✅ **Expected:** "Admin added a new court..." notification appears for super admin

#### Test 5: Admin Publishes Competition
1. Login as Admin
2. Go to Competitions/Tournaments
3. Create and publish a new competition
4. Check notifications:
   - As Super Admin: Should see admin activity notification
   - As Player in that club: Should see competition announcement
✅ **Expected:** Both super admin and players see notifications

#### Test 6: Admin Updates Booking
1. Login as Admin
2. Go to Bookings
3. Accept/decline a booking
4. Login as the Player who made the booking
5. Check notifications
✅ **Expected:** "Your booking... has been ACCEPTED/DECLINED" appears

---

## 🔍 Verification Checklist

After running the migration, verify:

- [ ] Migration ran without errors
- [ ] Can assign player to coach
- [ ] Player receives assignment notification
- [ ] Can schedule training session
- [ ] Player receives training notification
- [ ] Can add feedback to player
- [ ] Player receives feedback notification
- [ ] Can add court as admin
- [ ] Super admin receives court notification
- [ ] Can publish competition
- [ ] Super admin receives competition notification
- [ ] Players receive competition notification
- [ ] Admin can accept/decline bookings
- [ ] Player receives booking notification
- [ ] Coaches can see all players in club
- [ ] Admins can see bookings for their club
- [ ] Super admins see admin activity only

---

## 📊 Database State After Migration

### New Columns in `notifications` Table
```sql
ALTER TABLE public.notifications ADD COLUMN notification_type_id text;
ALTER TABLE public.notifications ADD COLUMN related_entity_id uuid;
ALTER TABLE public.notifications ADD COLUMN related_entity_type text;
```

### New RLS Policies

#### Notifications Table
- "Users can see their own notifications"
- "Admins can see booking notifications for their club"
- "Super admins can see admin activity notifications"
- "Users can update their own notifications"
- "Service role can insert notifications"

#### Coach-Students Table
- "Coach can see their own students"
- "Students can see their assigned coaches"
- "Admins can manage coach-student relationships in their club"
- "Coaches can assign students in their club"

#### Profiles Table
- "Coaches can see club members"

#### Training Sessions Table
- "Coaches can schedule sessions for club players"
- "Students can see their training sessions"
- "Coaches can see their scheduled sessions"

#### Coach Feedbacks Table
- "Coaches can add feedback for club players"
- "Coaches can view their feedback"
- "Students can see their own feedbacks"

#### Tournaments Table
- "Admins can manage competitions in their club"
- "Players can see club competitions"

---

## 🔗 API Endpoints That Create Notifications

| Endpoint | Method | Creates Notification | Type | Recipient |
|----------|--------|----------------------|------|-----------|
| `/api/coach/students` | POST | Yes | `student_assignment` | Player |
| `/api/coach/sessions` | POST | Yes | `training_session` | Player |
| `/api/admin/bookings/:id` | PUT | Yes | `booking_update` | Player |
| `/api/admin/courts` | POST | Yes | `admin_added_court` | Super Admin |
| `/api/admin/competitions` | POST | Yes | `admin_published_competition` | Super Admin + `competition_published` | Player |
| StudentDetails (feedback) | Frontend | Yes | `coach_feedback` | Player |

---

## 📱 Frontend Components Affected

| Component | What Changed | Impact |
|-----------|-------------|--------|
| StudentDetails.tsx | Feedback notification includes related_entity_id | Improved notification tracking |
| NotificationBell.tsx | No changes needed | Works with new schema |
| NotificationService.ts | No changes needed | Compatible with new schema |

---

## 🔐 RLS Policy Implementation

The migration creates policies that automatically enforce:

1. **Coaches see all players in their club**
   - No need to filter player lists manually
   - API calls automatically return only authorized data

2. **Booking notifications only to booking owner**
   - Other players can't see your booking status
   - Admins can't see booking notifications (RLS blocks them)

3. **Super admins see admin activities**
   - Only notifications with type `admin_*` visible
   - Regular notifications hidden (RLS blocks them)

4. **Players see their own notifications**
   - Default policy blocks cross-player viewing
   - Enforced at database level (most secure)

---

## 🐛 Troubleshooting

### "Notifications not appearing"
1. Check that migration ran successfully
2. Verify user is querying `/api/notifications`
3. Check notification type matches expected value
4. Verify user_id is set correctly in database

### "Coach can't see players"
1. Verify both coach and players have same `club_id`
2. Check coach role is 'coach'
3. Run migration to ensure RLS policy exists

### "Super admin doesn't see notifications"
1. Verify super admin has role 'super_admin' or 'superadmin'
2. Check notification type is 'admin_added_court' or 'admin_published_competition'
3. Verify `related_entity_type` is set correctly

### "Permission denied" errors
1. Check that service role is used for backend operations
2. Verify RLS policies allow the operation
3. Check user_id vs auth.uid() consistency

---

## 📞 Support

If issues arise:
1. Check migration output for errors
2. Verify all RLS policies were created
3. Test with Supabase Studio (Tables view)
4. Check browser console for API errors
5. Verify user roles in `profiles` table

---

## ✅ Deployment Completed

After following these steps:
- ✅ Coaches can manage all club players
- ✅ Players receive assignment, session, and feedback notifications
- ✅ Admins see booking notifications
- ✅ Super admins see admin activities
- ✅ Booking notifications completely isolated to player
- ✅ All access controlled via RLS at database level
