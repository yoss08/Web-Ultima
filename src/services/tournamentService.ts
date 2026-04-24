import { supabase } from "../config/supabase";

export interface Tournament {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  max_players: number;
  current_players: number;
  prize_pool: string;
  status: 'Open' | 'Ongoing' | 'Finished' | 'Invite Only';
  image_url?: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  competition_type?: string;
  registration_deadline?: string;
  entry_fee: number;
  rules_text?: string;
  club_id?: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  registered_at: string;
  payment_status: 'Pending' | 'Completed' | 'Failed';
}

/**
 * Get all tournaments with optional filters
 */
export async function getTournaments(filters?: {
  status?: string;
  skillLevel?: string;
  clubId?: string;
}) {
  let query = supabase.from('tournaments').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.skillLevel && filters.skillLevel !== 'All') {
    query = query.eq('skill_level', filters.skillLevel);
  }
  if (filters?.clubId) {
    query = query.eq('club_id', filters.clubId);
  }

  query = query.order('start_date', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get a single tournament with registrations
 */
export async function getTournamentDetails(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select(
      `*,
       tournament_registrations(id, player_id, registered_at, payment_status, 
         profiles:player_id(id, full_name, avatar_url)
       )`
    )
    .eq('id', tournamentId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's tournament registrations
 */
export async function getUserTournamentRegistrations(userId: string) {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .select('tournament_id')
    .eq('player_id', userId);

  if (error) throw error;
  return (data || []).map(r => r.tournament_id);
}

/**
 * Register player for tournament
 */
export async function registerForTournament(
  tournamentId: string,
  playerId: string,
  paymentStatus: string = 'Pending'
) {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .insert([
      {
        tournament_id: tournamentId,
        player_id: playerId,
        payment_status: paymentStatus,
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Cancel tournament registration
 */
export async function cancelTournamentRegistration(
  tournamentId: string,
  playerId: string
) {
  const { error } = await supabase
    .from('tournament_registrations')
    .delete()
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId);

  if (error) throw error;
}

/**
 * Get tournament registrations
 */
export async function getTournamentRegistrations(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .select(
      `*,
       profiles:player_id(id, full_name, avatar_url, rating)`
    )
    .eq('tournament_id', tournamentId)
    .order('registered_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create tournament (Admin only)
 */
export async function createTournament(
  tournamentData: Omit<Tournament, 'id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('tournaments')
    .insert([tournamentData])
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Update tournament (Admin only)
 */
export async function updateTournament(
  tournamentId: string,
  updates: Partial<Tournament>
) {
  const { data, error } = await supabase
    .from('tournaments')
    .update(updates)
    .eq('id', tournamentId)
    .select();

  if (error) throw error;
  return data?.[0];
}

/**
 * Delete tournament (Admin only)
 */
export async function deleteTournament(tournamentId: string) {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', tournamentId);

  if (error) throw error;
}

/**
 * Get tournament statistics
 */
export async function getTournamentStats(tournamentId: string) {
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('current_players, max_players, status')
    .eq('id', tournamentId)
    .single();

  const { data: registrations, error } = await supabase
    .from('tournament_registrations')
    .select('id, payment_status')
    .eq('tournament_id', tournamentId);

  if (error) throw error;

  const stats = {
    totalRegistrations: registrations?.length || 0,
    currentPlayers: tournament?.current_players || 0,
    availableSpots: (tournament?.max_players || 0) - (tournament?.current_players || 0),
    isFull: (tournament?.current_players || 0) >= (tournament?.max_players || 0),
    paidRegistrations: registrations?.filter(r => r.payment_status === 'Completed').length || 0,
    pendingPayments: registrations?.filter(r => r.payment_status === 'Pending').length || 0,
  };

  return stats;
}

/**
 * Search tournaments
 */
export async function searchTournaments(query: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get active tournaments (not finished, not invite only)
 */
export async function getActiveTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .neq('status', 'Finished')
    .neq('status', 'Invite Only')
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get upcoming tournaments (based on start_date)
 */
export async function getUpcomingTournaments(days: number = 30) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .gte('start_date', now.toISOString().split('T')[0])
    .lte('start_date', futureDate.toISOString().split('T')[0])
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}
