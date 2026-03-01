import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * SHARED COMPETITION ENDPOINTS
 */

// GET /api/competitions - list competitions
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('start_date', { ascending: true });
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/competitions/:id - competition details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/competitions/:id/register - register for competition
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { player_id } = req.body;
    
    if (!player_id) return res.status(400).json({ error: "player_id is required" });

    const { data, error } = await supabase
      .from('competition_participants')
      .insert([{ competition_id: id, player_id, status: 'registered' }])
      .select();
      
    if (error) throw error;
    res.status(201).json({ success: true, message: "Registered successfully", record: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
