import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * PLAYER ENDPOINTS
 */

// GET /api/player/stats - player statistics
router.get('/stats', async (req, res) => {
  try {
    const playerId = req.query.playerId;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', playerId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || { wins: 0, losses: 0, rank: "Unranked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/player/matches - match history
router.get('/matches', async (req, res) => {
  try {
    const playerId = req.query.playerId;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/player/profile - player profile
router.get('/profile', async (req, res) => {
  try {
    const playerId = req.query.playerId;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', playerId)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/player/profile - update profile
router.put('/profile', async (req, res) => {
  try {
    const playerId = req.body.id || req.query.playerId;
    const updates = req.body;
    
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', playerId)
      .select();
      
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/player/notifications/:id/respond - respond to an assignment or request
router.post('/notifications/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'confirm' or 'decline'

    // 1. Fetch the notification to get details
    const { data: notif, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (notifError || !notif) return res.status(404).json({ error: "Notification not found" });

    if (notif.type === 'student_assignment') {
      const coachId = notif.related_entity_id;
      const studentId = notif.user_id;

      if (action === 'confirm') {
        // Upsert into coach_students
        const { error: assignError } = await supabase
          .from('coach_students')
          .upsert([{ coach_id: coachId, student_id: studentId }], { onConflict: 'coach_id,student_id' });

        if (assignError) throw assignError;

        // NEW: Sync the player's club_id with the coach's club_id so they show up in AdminPlayersPage
        const { data: coachData } = await supabase
          .from('profiles')
          .select('club_id')
          .eq('id', coachId)
          .single();

        if (coachData?.club_id) {
          await supabase
            .from('profiles')
            .update({ club_id: coachData.club_id })
            .eq('id', studentId);
        }

        // Notify coach
        const { data: studentProfile } = await supabase.from('profiles').select('full_name').eq('id', studentId).single();
        await supabase.from('notifications').insert([{
          user_id: coachId,
          type: 'assignment_confirmed',
          message: `${studentProfile?.full_name || 'A player'} has accepted your coaching request!`,
          related_entity_id: studentId,
          related_entity_type: 'player',
          read: false
        }]);

        // Update notification message
        await supabase.from('notifications').update({ 
          message: `You confirmed the coaching request from coach.`,
          read: true 
        }).eq('id', id);

      } else {
        // Notify coach of decline
        const { data: studentProfile } = await supabase.from('profiles').select('full_name').eq('id', studentId).single();
        await supabase.from('notifications').insert([{
          user_id: coachId,
          type: 'assignment_declined',
          message: `${studentProfile?.full_name || 'A player'} has declined your coaching request.`,
          related_entity_id: studentId,
          related_entity_type: 'player',
          read: false
        }]);

        // Update notification message
        await supabase.from('notifications').update({ 
          message: `You declined the coaching request.`,
          read: true 
        }).eq('id', id);
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
