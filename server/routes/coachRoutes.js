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
    if (!coachId) return res.status(400).json({ error: "coachId is required" });

    // 1. Student Count
    const { count: studentCount } = await supabase
      .from('coach_students')
      .select('*', { count: 'exact', head: true })
      .eq('coach_id', coachId);

    // 2. Upcoming Sessions (Today)
    const today = new Date().toISOString().split('T')[0];
    const { count: sessionCount } = await supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('coach_id', coachId)
      .gte('start_time', `${today}T00:00:00Z`)
      .lte('start_time', `${today}T23:59:59Z`);

    // 3. Performance Avg (Mocked for now or calculated from coach_feedbacks)
    const { data: feedbacks } = await supabase
      .from('coach_feedbacks')
      .select('rating')
      .eq('coach_id', coachId);
    
    const avg = feedbacks?.length 
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) 
      : "0.0";

    res.json({
      studentCount: studentCount || 0,
      upcomingSessions: sessionCount || 0,
      performanceAvg: avg
    });
  } catch (error) {
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
        profiles!student_id (id, full_name, avatar_url, account_type)
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

    // 3. Performance Trend (Mocked for now or from coach_feedbacks)
    const { data: trend } = await supabase
      .from('coach_feedbacks')
      .select('created_at, rating, technique, power, speed, stamina, mental')
      .eq('student_id', id)
      .order('created_at', { ascending: true });

    res.json({
      profile,
      matches: matches || [],
      performanceTrend: trend || [],
      stats: {
        winRate: "65%", // Placeholder
        totalMatches: matches?.length || 0,
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
      .select('*')
      .eq('coach_id', coachId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/coach/sessions - schedule training session
router.post('/sessions', async (req, res) => {
  try {
    const sessionData = req.body;
    
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([sessionData])
      .select();
      
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
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

export default router;
