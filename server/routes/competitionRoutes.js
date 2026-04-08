import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * SHARED TOURNAMENT ENDPOINTS
 */

// GET /api/competitions - list tournaments
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('rpc_list_tournaments');
      
    if (error) throw error;
    
    // Status mapping for frontend compatibility
    const mappedData = data.map(t => ({
      ...t,
      status: t.status === 'Finished' ? 'Completed' : 
              t.status === 'Invite Only' ? 'Closed' : t.status
    }));

    res.json(mappedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/competitions/:id - tournament details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/competitions/:id/register - register for tournament
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { player_id } = req.body;
    
    if (!player_id) return res.status(400).json({ error: "player_id is required" });

    // Using the verified registration table 'tournament_registrations'
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([{ tournament_id: id, player_id }])
      .select();
      
    if (error) throw error;
    res.status(201).json({ success: true, message: "Registered successfully", record: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
