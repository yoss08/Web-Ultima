import { supabase } from '../config/supabase';
import { ADMIN_API } from '../config/apiConfig';

/**
 * Attaches the current Supabase session token to every fetch request.
 * Without this the backend auth middleware rejects with 401/403.
 */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated. Please log in again.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export const adminService = {
  // ─── PLAYERS ────────────────────────────────────────────────
  async getUnassignedPlayers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'player')
      .is('coach_id', null);
    
    if (error) throw error;
    return data ?? [];
  },

  async getClubPlayers(clubId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'player')
      .eq('club_id', clubId);
    
    if (error) throw error;
    return data ?? [];
  },

  async getStaffAndPlayers(clubId: string) {
    // Get profiles explicitly assigned to this club (Admins & Players)
    const { data: assignedProfiles, error: assignedError } = await supabase
      .from('profiles')
      .select('*')
      .eq('club_id', clubId);

    if (assignedError) throw assignedError;

    // Get bookings for this club to find players who booked
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('club_id', clubId)
      .not('user_id', 'is', null);

    if (bookingsError) throw bookingsError;

    const bookedUserIds = Array.from(new Set(bookings.map((b: any) => b.user_id)));
    
    let bookedProfiles: any[] = [];
    if (bookedUserIds.length > 0) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', bookedUserIds);
        
      if (error) throw error;
      bookedProfiles = data ?? [];
    }

    // Combine and deduplicate by ID
    const allProfiles = [...(assignedProfiles ?? []), ...bookedProfiles];
    const uniqueProfiles = Array.from(new Map(allProfiles.map((item) => [item.id, item])).values());

    // Filter to only admins and players
    return uniqueProfiles.filter(p => p.role === 'admin' || p.role === 'player');
  },

  // ─── COACHES ────────────────────────────────────────────────
  async getAllCoaches() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'coach');
    
    if (error) throw error;
    return data ?? [];
  },

  async getClubCoaches(clubId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'coach')
      .eq('club_id', clubId);
    
    if (error) throw error;
    return data ?? [];
  },

  async getUnassignedCoaches() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'coach')
      .is('club_id', null);
    
    if (error) throw error;
    return data ?? [];
  },

  async assignCoachToClub(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/coaches/${coachId}/assign`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to assign coach to club');
    return response.json();
  },

  async unassignCoachFromClub(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/coaches/${coachId}/unassign`, {
      method: 'PUT',
      headers,
    });
    if (!response.ok) throw new Error('Failed to unassign coach from club');
    return response.json();
  },

  async assignCoachToPlayer(playerId: string, coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${ADMIN_API}/players/${playerId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ coach_id: coachId }),
    });
    if (!response.ok) throw new Error('Failed to assign coach');
    return response.json();
  },

  // ─── BOOKINGS ───────────────────────────────────────────────
  async getClubBookings(clubId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, profiles(full_name), courts(name)')
      .eq('club_id', clubId);
    
    if (error) throw error;

    // Transform data to include start_time and end_time for the Admin UI
    return (data || []).map(booking => {
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
  },

  async acceptBooking(bookingId: string | number) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    const notificationPayload = {
      email: data.email,
      booking_date: data.booking_date,
      time_slot: data.time_slot,
      status: 'ACCEPTED',
      message: `Your booking for ${data.booking_date} at ${data.time_slot} has been ACCEPTED.`,
    };

    if (data.user_id) {
      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        type: 'booking_update',
        message: notificationPayload.message,
        read: false,
      }]);
    } else if (data.email) {
      const { error: emailError } = await supabase.functions.invoke('send-booking-status-email', {
        body: JSON.stringify(notificationPayload),
      });
      if (emailError) console.warn('Booking acceptance email failed:', emailError);
    }

    return data;
  },

  async rejectBooking(bookingId: string | number) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'declined' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    const notificationPayload = {
      email: data.email,
      booking_date: data.booking_date,
      time_slot: data.time_slot,
      status: 'DECLINED',
      message: `Your booking for ${data.booking_date} at ${data.time_slot} has been DECLINED.`,
    };

    if (data.user_id) {
      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        type: 'booking_update',
        message: notificationPayload.message,
        read: false,
      }]);
    } else if (data.email) {
      const { error: emailError } = await supabase.functions.invoke('send-booking-status-email', {
        body: JSON.stringify(notificationPayload),
      });
      if (emailError) console.warn('Booking decline email failed:', emailError);
    }

    return data;
  },

  // ─── COURTS ─────────────────────────────────────────────────
  async getAllCourts() {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getClubCourts(clubId: string) {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('club_id', clubId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addCourt(courtData: { name: string; type: string; status: string; club_id?: string }) {
    const { data, error } = await supabase
      .from('courts')
      .insert([{
        ...courtData,
        type: courtData.type ? courtData.type.toLowerCase() : null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCourt(courtId: string | number) {
    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', courtId);
    
    if (error) throw error;
    return { success: true };
  },

  async updateCourt(courtId: string | number, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('courts')
      .update(updates)
      .eq('id', courtId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourtStatus(courtId: string | number, status: string) {
    const { data, error } = await supabase
      .from('courts')
      .update({ status })
      .eq('id', courtId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ─── MATCHES ────────────────────────────────────────────────
  async getClubMatches(clubId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *, 
        player1:profiles!player1_id(full_name), 
        player2:profiles!player2_id(full_name),
        player3:profiles!player3_id(full_name),
        player4:profiles!player4_id(full_name),
        booking:bookings(booking_date, time_slot, courts(name, club_id))
      `)
      .eq('club_id', clubId);
    
    if (error) throw error;
    return data;
  },

  async createMatch(matchData: {
    booking_id?: string | number;
    player1_id: string;
    player2_id?: string;
    court_id: string | number;
    status: 'live' | 'completed';
    start_time?: string;
    end_time?: string;
    club_id?: string;
  }) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateScore(matchId: string | number, score: string) {
    const { data, error } = await supabase
      .from('matches')
      .update({ score: score })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMatchStatus(matchId: string | number, status: string, additionalUpdates: Record<string, any> = {}) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status, ...additionalUpdates })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ─── ANALYTICS ──────────────────────────────────────────────
  async getGlobalStats() {
    // Basic implementation using Supabase
    const [players, bookings, matches] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('matches').select('id', { count: 'exact', head: true }),
    ]);

    return {
      totalPlayers: players.count || 0,
      totalBookings: bookings.count || 0,
      totalMatches: matches.count || 0,
    };
  },

  async getClubStats(clubId: string) {
    const today = new Date().toISOString().split('T')[0];
    
    const [bookings, courts] = await Promise.all([
      supabase.from('bookings').select('*').eq('club_id', clubId),
      supabase.from('courts').select('*').eq('club_id', clubId),
    ]);

    const clubBookings = bookings.data || [];
    const clubCourts = courts.data || [];

    return {
      pendingBookings: clubBookings.filter(b => b.status === 'pending').length,
      confirmedToday: clubBookings.filter(b => (b.status === 'confirmed' || b.status === 'accepted') && b.booking_date === today).length,
      totalCourts: clubCourts.length,
      availableCourts: clubCourts.filter(c => c.status === 'available').length,
      maintenanceCourts: clubCourts.filter(c => c.status === 'maintenance').length,
    };
  },

  // ─── CLUB INFO ──────────────────────────────────────────────
  /**
   * Fetches the club assigned to the currently logged-in admin directly via
   * Supabase — bypasses Express so there's no URL/auth issue on the GET.
   */
  async getClubInfo() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('club_id')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);
    if (!profile?.club_id) throw new Error('No club assigned to this admin account yet.');

    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', profile.club_id)
      .single();

    if (clubError) throw new Error(clubError.message);

    // Also return court count so the header shows the right number
    const { count } = await supabase
      .from('courts')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', profile.club_id);

    return { ...club, court_count: count ?? 0 };
  },

  /**
   * Updates the club info directly via Supabase.
   */
  async updateClubInfo(clubId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('clubs')
      .update(updates)
      .eq('id', clubId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};