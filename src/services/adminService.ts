import { supabase } from "../config/supabase";

export const adminService = {
  /**
   * COURTS MANAGEMENT
   */
  // Récupérer tous les terrains
  async getAllCourts() {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Ajouter un nouveau terrain
  async addCourt(courtData: { name: string; type: string; status: string }) {
    const { data, error } = await supabase
      .from('courts')
      .insert([courtData])
      .select();
    if (error) throw error;
    return data;
  },

  // Supprimer un terrain
  async deleteCourt(courtId: string | number) {
    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', courtId);
    if (error) throw error;
  },

  /**
   * MATCHES & LIVE SCORING
   */
  // Créer un match en direct
  async createMatch(matchData: {
    player1_id: string;
    player2_id: string;
    court_id: string | number;
    status: 'live' | 'completed';
  }) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select();
    if (error) throw error;
    return data;
  },

  // Mettre à jour le score en temps réel
  async updateScore(matchId: string | number, score: string) {
    const { error } = await supabase
      .from('matches')
      .update({ current_score: score })
      .eq('id', matchId);
    if (error) throw error;
  },

  /**
   * USER & COACH ASSIGNMENT
   */
  // Récupérer les joueurs qui n'ont pas encore de coach
  async getUnassignedPlayers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('account_type', 'player')
      .is('coach_id', null);
    if (error) throw error;
    return data;
  },

  // Assigner un coach à un élève
  async assignCoachToStudent(studentId: string, coachId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ coach_id: coachId })
      .eq('id', studentId);
    if (error) throw error;
  },

  /**
   * ANALYTICS
   */
  // Récupérer les statistiques globales pour le dashboard
  async getGlobalStats() {
    // Cette fonction peut combiner plusieurs requêtes ou appeler une fonction RPC Supabase
    const { count: activeMatches } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'live');

    const { count: totalPlayers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('account_type', 'player');

    return { activeMatches, totalPlayers };
  }
};