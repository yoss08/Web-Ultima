import { supabase } from '../config/supabase';
import { API_URL } from '../config/apiConfig';

/**
 * Returns the Authorization header for the current Supabase session.
 * All fetch-based API calls MUST include this — without it the backend
 * auth middleware rejects the request and the operation silently fails.
 */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated. Please log in again.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export const superAdminService = {
  // ─── ADMIN ACCOUNTS ─────────────────────────────────────────

  async getAllAdmins() {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/api/superadmin/admins`, { headers });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch admins');
    }
    return response.json();
  },

  async createAdminAccount(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    clubId: string;
  }) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/api/superadmin/admins`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        clubId: data.clubId,
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create admin account');
    }
    return response.json();
  },

  async deleteAdminAccount(userId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/api/superadmin/admins/${userId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete admin');
    }
    return response.json();
  },

  // ─── CLUBS ──────────────────────────────────────────────────

  async getAllClubs() {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(`clubs fetch failed: ${error.message} — check RLS policies on the clubs table`);
    return data ?? [];
  },

  async createClub(clubData: {
    name: string;
    photo_url?: string;
    location: string;
    open_time: string;
    close_time: string;
    price_per_court: number;
    description?: string;
  }) {
    const { data, error } = await supabase.from('clubs').insert([clubData]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateClub(
    id: string,
    clubData: Partial<{
      name: string;
      photo_url: string;
      location: string;
      open_time: string;
      close_time: string;
      price_per_court: number;
      description: string;
    }>
  ) {
    const { data, error } = await supabase
      .from('clubs')
      .update(clubData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteClub(id: string) {
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ─── USERS ──────────────────────────────────────────────────

  async updateUserBanStatus(userId: string, isBanned: boolean) {
  const { error } = await supabase
    .from("profiles")        // replace with your actual table name
    .update({ is_banned: isBanned })
    .eq("id", userId);
  if (error) throw new Error(error.message);
},
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, club_id, created_at, phone, is_banned')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async deleteUser(id: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/api/superadmin/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete user');
    }
    return response.json();
  },

  async updateUserRole(id: string, role: string) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ─── BOOKINGS ───────────────────────────────────────────────

  async getAllBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, user_id, court_id, club_id, booking_date, time_slot, status,
        profiles ( full_name ),
        courts ( name ),
        clubs ( name )
      `)
      .order('booking_date', { ascending: false });

    if (error) throw new Error(error.message);

    // Transform data to include start_time and end_time for the UI
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
    }) ?? [];
  },

  async cancelBooking(bookingId: string | number) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    if (error) throw new Error(error.message);
  },

  // ─── COACHES ────────────────────────────────────────────────

  async getAllCoaches() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, club_id, created_at')
      .eq('role', 'coach');
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  // ─── STATS ──────────────────────────────────────────────────

  /** Direct Supabase counts — no RPC function needed */
  async getPlatformStats() {
    const [clubs, users, bookings, admins, coaches, pending] = await Promise.all([
      supabase.from('clubs').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'coach'),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      totalClubs: clubs.count ?? 0,
      totalUsers: users.count ?? 0,
      totalBookings: bookings.count ?? 0,
      activeAdmins: admins.count ?? 0,
      totalCoaches: coaches.count ?? 0,
      pendingBookings: pending.count ?? 0,
    };
  },

  // ─── COMPETITIONS & MATCHES ────────────────────────────────
  async createCompetition(data: {
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    club_id: string;
    status: string;
  }) {
    const { data: result, error } = await supabase
      .from('tournaments')
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return result;
  },

  async createMatch(data: {
    player1_id: string;
    player2_id: string;
    player3_id?: string;
    player4_id?: string;
    court_id: string;
    club_id: string;
    status: string;
    match_type: string;
  }) {
    const { data: result, error } = await supabase
      .from('matches')
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return result;
  },
};