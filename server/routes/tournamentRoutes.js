import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * ============================================================
 * TOURNAMENT ENDPOINTS
 * ============================================================
 */

/**
 * GET /api/tournaments
 * Get all tournaments visible to the user
 * Players see all open tournaments, super admins see all
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get user role to determine visibility
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = supabase
      .from('tournaments')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        max_players,
        current_players,
        prize_pool,
        competition_type,
        registration_deadline,
        entry_fee,
        rules_text,
        status,
        created_by,
        club_id,
        created_at
      `)
      .order('start_date', { ascending: true });

    // Super admins see all tournaments, others see only active/open ones
    if (userProfile.role !== 'superadmin' && userProfile.role !== 'super_admin' && userProfile.role !== 'super admin') {
      query = query.eq('status', 'open');
    }

    const { data, error } = await query;

    if (error) throw error;

    // For each tournament, check if user is registered
    if (userProfile.role === 'player') {
      const tournaments = await Promise.all(
        data.map(async (tournament) => {
          const { data: registration } = await supabase
            .from('tournament_registrations')
            .select('id, status')
            .eq('tournament_id', tournament.id)
            .eq('player_id', userId)
            .single();

          return {
            ...tournament,
            userRegistration: registration || null,
          };
        })
      );
      res.json(tournaments);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('[Tournaments] Fetch tournaments error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tournaments/:id
 * Get a specific tournament
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        max_players,
        current_players,
        prize_pool,
        competition_type,
        registration_deadline,
        entry_fee,
        rules_text,
        status,
        created_by,
        club_id,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get registrations for this tournament
    const { data: registrations, error: regError } = await supabase
      .from('tournament_registrations')
      .select('id, player_id, status, registered_at')
      .eq('tournament_id', id);

    if (regError) throw regError;

    // Get player info for registrations
    if (registrations && registrations.length > 0) {
      const playerIds = registrations.map(r => r.player_id);
      const { data: players } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', playerIds);

      const enrichedRegistrations = registrations.map(reg => {
        const player = players.find(p => p.id === reg.player_id);
        return {
          ...reg,
          player: player || null,
        };
      });

      res.json({
        ...data,
        registrations: enrichedRegistrations,
        userRegistration:
          userId && registrations.find(r => r.player_id === userId)
            ? registrations.find(r => r.player_id === userId)
            : null,
      });
    } else {
      res.json({
        ...data,
        registrations: [],
        userRegistration: null,
      });
    }
  } catch (error) {
    console.error('[Tournaments] Fetch tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/tournaments
 * Create a new tournament (super admin only)
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify user is super admin
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userProfile || !['superadmin', 'super_admin', 'super admin'].includes(userProfile.role)) {
      return res.status(403).json({ error: 'Only super admins can create tournaments' });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      maxPlayers,
      prizePool,
      competitionType,
      registrationDeadline,
      entryFee,
      rulesText,
      clubId,
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ error: 'Title and start date are required' });
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert([
        {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          max_players: maxPlayers || 32,
          current_players: 0,
          prize_pool: prizePool || '$0',
          competition_type: competitionType || 'Open',
          registration_deadline: registrationDeadline,
          entry_fee: entryFee || 0,
          rules_text: rulesText,
          club_id: clubId,
          created_by: userId,
          status: 'open',
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('[Tournaments] Create tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tournaments/:id
 * Update a tournament (super admin only)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get tournament and verify creator
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (tournament.created_by !== userId) {
      return res.status(403).json({ error: 'Only the tournament creator can update it' });
    }

    const {
      title,
      description,
      endDate,
      maxPlayers,
      prizePool,
      competitionType,
      registrationDeadline,
      entryFee,
      rulesText,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from('tournaments')
      .update({
        title,
        description,
        end_date: endDate,
        max_players: maxPlayers,
        prize_pool: prizePool,
        competition_type: competitionType,
        registration_deadline: registrationDeadline,
        entry_fee: entryFee,
        rules_text: rulesText,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    console.error('[Tournaments] Update tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/tournaments/:id
 * Delete a tournament (super admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get tournament and verify creator
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (tournament.created_by !== userId) {
      return res.status(403).json({ error: 'Only the tournament creator can delete it' });
    }

    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Tournament deleted' });
  } catch (error) {
    console.error('[Tournaments] Delete tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ============================================================
 * TOURNAMENT REGISTRATION ENDPOINTS
 * ============================================================
 */

/**
 * POST /api/tournaments/:id/join
 * Join a tournament (players only)
 */
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify user is a player
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userProfile || userProfile.role !== 'player') {
      return res.status(403).json({ error: 'Only players can join tournaments' });
    }

    // Check tournament exists and has space
    const { data: tournament, error: tournError } = await supabase
      .from('tournaments')
      .select('id, max_players, current_players, status, registration_deadline')
      .eq('id', id)
      .single();

    if (tournError) throw tournError;

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status !== 'open') {
      return res.status(400).json({ error: 'Tournament is no longer open for registration' });
    }

    if (tournament.current_players >= tournament.max_players) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    if (tournament.registration_deadline && new Date(tournament.registration_deadline) < new Date()) {
      return res.status(400).json({ error: 'Registration deadline has passed' });
    }

    // Register player
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([
        {
          tournament_id: id,
          player_id: userId,
          status: 'pending',
        },
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'You are already registered for this tournament' });
      }
      throw error;
    }

    // Update tournament current_players count
    await supabase
      .from('tournaments')
      .update({
        current_players: tournament.current_players + 1,
      })
      .eq('id', id);

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('[Tournaments] Join tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/tournaments/:id/leave
 * Leave a tournament (players only)
 */
router.delete('/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get tournament
    const { data: tournament, error: tournError } = await supabase
      .from('tournaments')
      .select('id, current_players')
      .eq('id', id)
      .single();

    if (tournError) throw tournError;

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Check registration exists
    const { data: registration, error: regError } = await supabase
      .from('tournament_registrations')
      .select('id')
      .eq('tournament_id', id)
      .eq('player_id', userId)
      .single();

    if (regError && regError.code !== 'PGRST116') throw regError;

    if (!registration) {
      return res.status(404).json({ error: 'You are not registered for this tournament' });
    }

    // Remove registration
    const { error: deleteError } = await supabase
      .from('tournament_registrations')
      .delete()
      .eq('id', registration.id);

    if (deleteError) throw deleteError;

    // Update tournament current_players count
    await supabase
      .from('tournaments')
      .update({
        current_players: Math.max(0, tournament.current_players - 1),
      })
      .eq('id', id);

    res.json({ success: true, message: 'Successfully withdrawn from tournament' });
  } catch (error) {
    console.error('[Tournaments] Leave tournament error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tournaments/:id/registrations
 * Get all registrations for a tournament (super admin only)
 */
router.get('/:id/registrations', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify user is super admin
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userProfile || !['superadmin', 'super_admin', 'super admin'].includes(userProfile.role)) {
      return res.status(403).json({ error: 'Only super admins can view registrations' });
    }

    const { data, error } = await supabase
      .from('tournament_registrations')
      .select(`
        id,
        tournament_id,
        player_id,
        registered_at,
        status,
        profiles:player_id(id, full_name, email)
      `)
      .eq('tournament_id', id)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('[Tournaments] Fetch registrations error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
