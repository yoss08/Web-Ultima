const API_URL = '/api';

export const adminService = {
  // Récupérer les joueurs qui n'ont pas de coach_id
  async getUnassignedPlayers() {
    const response = await fetch(`${API_URL}/admin/players`);
    if (!response.ok) throw new Error('Failed to fetch players');
    const players = await response.json();
    return players.filter((p: any) => !p.coach_id);
  },

  // Récupérer tous les profils de type Coach
  async getAllCoaches() {
    const response = await fetch(`${API_URL}/admin/players`); // In a real app, create a specific endpoint or generic profiles one
    if (!response.ok) throw new Error('Failed to fetch coaches');
    const profiles = await response.json();
    return profiles.filter((p: any) => p.account_type === 'Coach');
  },

  // Mettre à jour le coach d'un joueur
  async assignCoachToPlayer(playerId: string, coachId: string) {
    const response = await fetch(`${API_URL}/admin/players/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coach_id: coachId })
    });
    if (!response.ok) throw new Error('Failed to assign coach');
    return response.json();
  },

  /*
     COURT MANAGEMENT
   */
  // Récupérer tous les terrains
  async getAllCourts() {
    const response = await fetch(`${API_URL}/admin/courts`);
    if (!response.ok) throw new Error('Failed to fetch courts');
    return response.json();
  },

  // Ajouter un nouveau terrain
  async addCourt(courtData: { name: string; type: string; status: string }) {
    const response = await fetch(`${API_URL}/admin/courts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courtData)
    });
    if (!response.ok) throw new Error('Failed to add court');
    return response.json();
  },

  // Supprimer un terrain
  async deleteCourt(courtId: string | number) {
    const response = await fetch(`${API_URL}/admin/courts/${courtId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete court');
    return response.json();
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
    // Reusing the bookings/matches idea, assuming a match creation API exists over time, or using a generic one
    const response = await fetch(`${API_URL}/admin/bookings`, { // Mock fallback
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) throw new Error('Failed to create match');
    return response.json();
  },

  // Mettre à jour le score en temps réel
  async updateScore(matchId: string | number, score: string) {
    const response = await fetch(`${API_URL}/admin/bookings/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_score: score })
    });
    if (!response.ok) throw new Error('Failed to update score');
    return response.json();
  },

  /**
   * ANALYTICS
   */
  // Récupérer les statistiques globales pour le dashboard
  async getGlobalStats() {
    const response = await fetch(`${API_URL}/admin/reports/overview`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};