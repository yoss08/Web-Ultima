import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * COURTS ENDPOINTS
 */

// GET /api/admin/courts - all courts
router.get('/courts', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('club_id', clubId)
      .order('name', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/courts - create court
router.post('/courts', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { name, type, status, capacity, surface } = req.body;
    const { data, error } = await supabase
      .from('courts')
      .insert([{ 
        name, 
        type: type ? type.toLowerCase() : null, 
        status, 
        capacity, 
        surface, 
        club_id: clubId
      }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/courts/:id - update court
router.put('/courts/:id', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('courts')
      .update(updates)
      .eq('id', id)
      .eq('club_id', clubId)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/courts/:id - delete court
router.delete('/courts/:id', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { id } = req.params;
    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', id)
      .eq('club_id', clubId);
    if (error) throw error;
    res.json({ success: true, message: "Court deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADMIN BOOKINGS ENDPOINTS
 */
router.get('/bookings', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase
      .from('bookings')
      .select('*, profiles(full_name), courts(name, club_id)')
      .eq('club_id', clubId);
    if (error) throw error;

    // Transform data to include start_time and end_time for the Admin UI
    const transformedData = data.map(booking => {
      if (booking.booking_date && booking.time_slot) {
        const [start, end] = booking.time_slot.split(' - ');
        return {
          ...booking,
          start_time: `${booking.booking_date}T${start}:00`,
          end_time: `${booking.booking_date}T${end}:00`
        };
      }
      return booking;
    });

    res.json(transformedData);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});


router.post('/bookings', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const bookingData = { ...req.body, club_id: clubId };
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/bookings/:id', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase.from('bookings')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('club_id', clubId)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { error } = await supabase.from('bookings')
      .delete()
      .eq('id', req.params.id)
      .eq('club_id', clubId);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

/**
 * ADMIN MATCHES ENDPOINTS
 */
router.get('/matches', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase
      .from('matches')
      .select('*, player1:profiles!player1_id(full_name), player2:profiles!player2_id(full_name), booking:bookings(booking_date, time_slot, courts(name, club_id))')
      .eq('club_id', clubId);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADMIN PLAYERS ENDPOINTS
 */
router.get('/players', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    // Return players and coaches for this club
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, role, avatar_url, created_at, club_id')
      .in('role', ['player', 'coach', 'admin'])
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/players', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    // In a real app, you would use supabase.auth.admin.createUser here
    res.status(501).json({ message: "Admin user creation via API not fully implemented in mock" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/players/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

/**
 * ADMIN TOURNAMENTS ENDPOINTS
 */
router.get('/competitions', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase.from('tournaments').select('*').eq('club_id', clubId);
    if (error) throw error;
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/competitions', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const tournamentData = { ...req.body, club_id: clubId };
    const { data, error } = await supabase.from('tournaments').insert([tournamentData]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/competitions/:id', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    const { data, error } = await supabase.from('tournaments')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('club_id', clubId)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

/**
 * ADMIN REPORTS ENDPOINTS
 */
router.get('/reports/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (type === 'overview') {
      const { data, error } = await supabase.rpc('rpc_admin_overview');
      
      if (error) throw error;
      
      // Ensure the response matches the frontend expectation
      return res.json({
        activeMatches: data.activeMatches || 0,
        totalPlayers: data.totalPlayers || 0,
        availableCourts: data.availableCourts || "0/0",
        maintenanceCount: data.maintenanceCount || 0,
        totalMatchesToday: data.totalMatchesToday || 0,
        hydrationTotal: data.hydrationTotal || "24.5L"
      });
    }

    if (type === 'revenue') {
      res.json({ total: 10000, Breakdown: 'Mocked data' });
    } else {
      res.json({ report: type, data: [] });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

/**
 * ADMIN CLUB INFO ENDPOINT
 */
router.get('/club', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    console.log('[AdminClub] Admin club_id from auth:', clubId);
    console.log('[AdminClub] Admin user:', req.user?.id, req.user?.email);
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    
    // Get club details
    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();
    console.log('[AdminClub] Fetched club:', club);
    if (clubError) {
      console.log('[AdminClub] Club error:', clubError);
      throw clubError;
    }
    
    // Get court count
    const { count: courtCount } = await supabase
      .from('courts')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId);
    
    res.json({ ...club, court_count: courtCount || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/club - update club info
router.put('/club', async (req, res) => {
  try {
    const clubId = req.user?.club_id;
    if (!clubId) return res.status(403).json({ error: 'No club assigned to admin' });
    
    const updates = req.body;
    const { data, error } = await supabase
      .from('clubs')
      .update(updates)
      .eq('id', clubId)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
