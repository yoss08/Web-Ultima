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

export default router;
