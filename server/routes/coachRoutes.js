import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * COACH ENDPOINTS
 */

// GET /api/coach/stats - dashboard overview stats
router.get('/stats', async (req, res) => {
  try {
    const { coachId } = req.query;
    const finalCoachId = coachId || req.user?.id;
    
    if (!finalCoachId) return res.status(400).json({ error: "coachId is required" });

    // 1. Get student count
    const { count: studentCount, error: studentError } = await supabase
      .from('coach_students')
      .select('*', { count: 'exact', head: true })
      .eq('coach_id', finalCoachId);

    if (studentError) throw studentError;

    // 2. Get upcoming sessions (today or future)
    const today = new Date().toISOString().split('T')[0];
    const { count: sessionCount, error: sessionError } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('coach_id', finalCoachId)
      .gte('start_time', today);

    if (sessionError) throw sessionError;

    // 3. Get average rating from feedbacks
    const { data: feedbacks, error: feedbackError } = await supabase
      .from('coach_feedbacks')
      .select('rating')
      .eq('coach_id', finalCoachId);

    if (feedbackError) throw feedbackError;

    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbacks.length).toFixed(1)
      : "5.0";

    res.json({
      studentCount: studentCount || 0,
      upcomingSessions: sessionCount || 0,
      performanceAvg: avgRating
    });
  } catch (error) {
    console.error('[CoachStats] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/students - list of students
router.get('/students', async (req, res) => {
  try {
    const coachId = req.query.coachId; // Should ideally come from auth token
    if (!coachId) {
      return res.status(400).json({ error: "coachId parameter is required" });
    }

    const { data, error } = await supabase
      .from('coach_students')
      .select(`
        student_id,
        profiles!student_id (id, full_name, avatar_url)
      `)
      .eq('coach_id', coachId);
      
    if (error) throw error;
    res.json(data.map(item => item.profiles));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/students/:id/stats - student statistics & history
router.get('/students/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Core Profile & Skills
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
    
    // 2. Match History
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .or(`player1_id.eq.${id},player2_id.eq.${id}`)
      .order('created_at', { ascending: false })
      .limit(5);

    // 3. Performance Trend (from coach_feedbacks)
    const { data: trend } = await supabase
      .from('coach_feedbacks')
      .select('created_at, rating, technique, power, speed, stamina, mental')
      .eq('student_id', id)
      .order('created_at', { ascending: true });

    // 4. Calculate stats from matches
    const totalMatches = matches?.length || 0;
    const wins = matches?.filter(m => m.winner_id === id).length || 0;
    const winRate = totalMatches > 0 ? `${Math.round((wins / totalMatches) * 100)}%` : "0%";

    res.json({
      profile,
      matches: matches || [],
      performanceTrend: trend || [],
      stats: {
        winRate,
        totalMatches,
        skillLevel: profile?.skill_level || "Intermediate"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/sessions - list training sessions
router.get('/sessions', async (req, res) => {
  try {
    const coachId = req.query.coachId;
    if (!coachId) {
      return res.status(400).json({ error: "coachId is required" });
    }

    const { data, error } = await supabase
      .from('training_sessions')
      .select(`
        *,
        student:profiles!student_id (id, full_name, avatar_url),
        court:courts!court_id (id, name, type)
      `)
      .eq('coach_id', coachId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('[CoachRoutes] GET /sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/coach/sessions - schedule training session
router.post('/sessions', async (req, res) => {
  try {
    const sessionData = req.body;
    const requiredFields = ['coach_id', 'start_time', 'end_time', 'session_type'];
    const missingField = requiredFields.find((field) => !sessionData[field]);
    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }

    // Support both single student_id and array of student_ids
    const studentIds = Array.isArray(sessionData.student_ids) 
      ? sessionData.student_ids 
      : sessionData.student_id ? [sessionData.student_id] : [];

    if (studentIds.length === 0) {
      return res.status(400).json({ error: "At least one student_id is required" });
    }

    const { drill_plan, student_id, student_ids, ...otherData } = sessionData;
    const coachId = sessionData.coach_id;

    // Create session records for all students
    const sessionPayloads = studentIds.map(sid => {
      const payload = {
        coach_id: coachId,
        student_id: sid,
        court_id: otherData.court_id || null,
        start_time: otherData.start_time,
        end_time: otherData.end_time,
        session_type: otherData.session_type,
        notes: otherData.notes || '',
        status: sessionData.status || 'scheduled',
      };
      // Only include club_id if it exists on the user (avoids schema error if column not yet migrated)
      if (req.user?.club_id) payload.club_id = req.user.club_id;
      return payload;
    });

    const { data, error } = await supabase
      .from('training_sessions')
      .insert(sessionPayloads)
      .select();

    if (error) {
      console.error('[CoachRoutes] Supabase Insert Error:', error);
      throw error;
    }
    
    const createdSessions = data || [];

    // Fetch coach profile for notification message
    const { data: coachProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', coachId)
      .single();

    const coachName = coachProfile?.full_name || 'your coach';

    // Send notifications to all students
    try {
      const scheduledAt = new Date(sessionData.start_time);
      const formattedDate = scheduledAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const formattedTime = scheduledAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const notificationPayloads = createdSessions.map(session => ({
        user_id: session.student_id,
        type: 'training_session',
        message: `Coach ${coachName} scheduled a training session on ${formattedDate} at ${formattedTime}.`,
        related_entity_id: session.id,
        related_entity_type: 'training_session',
        read: false
      }));

      await supabase.from('notifications').insert(notificationPayloads);
    } catch (notifErr) {
      console.error('[CoachRoutes] Failed to send session notifications:', notifErr);
    }

    res.status(201).json(createdSessions);
  } catch (error) {
    console.error('[CoachRoutes] Error in POST /sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/coach/sessions - update training session
router.put('/sessions', async (req, res) => {
  try {
    const { session_ids, ...sessionData } = req.body;
    if (!session_ids || !Array.isArray(session_ids) || session_ids.length === 0) {
      return res.status(400).json({ error: "session_ids array is required" });
    }

    // Delete old sessions
    const { error: deleteError } = await supabase
      .from('training_sessions')
      .delete()
      .in('id', session_ids);

    if (deleteError) throw deleteError;

    // Create new sessions
    const studentIds = Array.isArray(sessionData.student_ids) 
      ? sessionData.student_ids 
      : sessionData.student_id ? [sessionData.student_id] : [];

    if (studentIds.length === 0) {
      return res.status(400).json({ error: "At least one student_id is required" });
    }

    const { drill_plan, student_id, student_ids, ...otherData } = sessionData;
    const coachId = sessionData.coach_id;

    const sessionPayloads = studentIds.map(sid => {
      const payload = {
        coach_id: coachId,
        student_id: sid,
        court_id: otherData.court_id || null,
        start_time: otherData.start_time,
        end_time: otherData.end_time,
        session_type: otherData.session_type,
        notes: otherData.notes || '',
        status: sessionData.status || 'scheduled',
      };
      if (req.user?.club_id) payload.club_id = req.user.club_id;
      return payload;
    });

    const { data, error: insertError } = await supabase
      .from('training_sessions')
      .insert(sessionPayloads)
      .select();

    if (insertError) throw insertError;
    
    res.json(data);
  } catch (error) {
    console.error('[CoachRoutes] Error in PUT /sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/coach/sessions - delete training sessions
router.delete('/sessions', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: "ids query parameter is required" });
    }

    const idArray = ids.split(',');

    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .in('id', idArray);

    if (error) throw error;
    res.json({ message: "Sessions deleted successfully" });
  } catch (error) {
    console.error('[CoachRoutes] Error in DELETE /sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/video-library - list videos for students
router.get('/video-library', async (req, res) => {
  try {
    const { coachId } = req.query;
    const { data, error } = await supabase
      .from('video_library')
      .select('*')
      .eq('coach_id', coachId)
      .order('created_at', { ascending: false });
      
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/recommendations - get AI training recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { coachId } = req.query;
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('coach_id', coachId)
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/coach/unassigned-players - list all player accounts in the coach's club
router.get('/unassigned-players', async (req, res) => {
  try {
    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, club_id, clubs(name)')
      .eq('role', 'player');

    const { data: players, error: playersError } = await query.order('full_name', { ascending: true });

    if (playersError) throw playersError;

    const { data: assigned, error: assignedError } = await supabase
      .from('coach_students')
      .select('student_id')
      .eq('coach_id', req.user.id);

    if (assignedError) throw assignedError;

    const assignedIds = new Set(assigned.map(a => a.student_id));
    const normalizedPlayers = (players || []).map(player => ({
      ...player,
      assigned_to_current_coach: assignedIds.has(player.id)
    }));

    res.json(normalizedPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/coach/students - request to assign a student to a coach
router.post('/students', async (req, res) => {
  try {
    const { coachId, studentId } = req.body;
    if (!coachId || !studentId) return res.status(400).json({ error: "coachId and studentId are required" });

    // 1. Check if already assigned
    const { data: existing } = await supabase
      .from('coach_students')
      .select('*')
      .eq('coach_id', coachId)
      .eq('student_id', studentId)
      .single();

    if (existing) {
      return res.status(400).json({ error: "This player is already assigned to you." });
    }

    // 2. Get coach name for the message
    const { data: coachProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', coachId)
      .single();
    
    const coachName = coachProfile?.full_name || 'A coach';

    // 3. Create notification for student with confirmation request
    const { data: notif, error: notifError } = await supabase.from('notifications').insert([{
      user_id: studentId,
      type: 'student_assignment',
      message: `Coach ${coachName} wants to add you to their roster. Do you confirm?`,
      related_entity_id: coachId,
      related_entity_type: 'coach',
      read: false
    }]).select();

    if (notifError) throw notifError;

    res.status(201).json({ message: "Assignment request sent to player", notificationId: notif[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/coach/students/:id - remove a student from the coach's roster
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const coachId = req.user.id;

    const { error } = await supabase
      .from('coach_students')
      .delete()
      .eq('coach_id', coachId)
      .eq('student_id', id);

    if (error) throw error;
    res.json({ message: "Student removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
