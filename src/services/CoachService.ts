import { supabase } from '../config/supabase';
import { COACH_API as API_URL } from '../config/apiConfig';

/**
 * Helper function to retrieve authorization headers with the current Supabase session token.
 * @returns {Promise<HeadersInit>} A promise that resolves to the headers object.
 * @throws {Error} If the user is not authenticated.
 */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated. Please log in again.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

/**
 * Service for handling coach-related operations.
 */
export const coachService = {
  // Récupérer les statistiques du dashboard
  /**
   * Retrieves dashboard statistics for a specific coach.
   * @param {string} coachId - The ID of the coach.
   * @returns {Promise<Object>} The statistics data.
   */
  async getStats(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/stats?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch coach stats');
    return response.json();
  },
  // Récupérer la liste des élèves assignés au coach
  /**
   * Retrieves the list of students assigned to a specific coach.
   * @param {string} coachId - The ID of the coach.
   * @returns {Promise<Array>} List of students.
   */
  async getMyStudents(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  // Récupérer les stats et l'historique d'un élève
  /**
   * Retrieves performance statistics and history for a specific student.
   * @param {string} studentId - The ID of the student.
   * @returns {Promise<Object>} The student statistics data.
   */
  async getStudentStats(studentId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students/${studentId}/stats`, { headers });
    if (!response.ok) throw new Error('Failed to fetch student stats');
    return response.json();
  },

  // Récupérer la bibliothèque vidéo
  /**
   * Retrieves the video library for a specific coach.
   * @param {string} coachId - The ID of the coach.
   * @returns {Promise<Array>} List of videos.
   */
  async getVideoLibrary(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/video-library?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch video library');
    return response.json();
  },

  // Récupérer les recommandations IA
  /**
   * Retrieves AI-powered recommendations for a specific coach.
   * @param {string} coachId - The ID of the coach.
   * @returns {Promise<Array>} List of recommendations.
   */
  async getRecommendations(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/recommendations?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  // Planifier une nouvelle session d'entraînement
  /**
   * Schedules a new training session.
   * @param {Object} sessionData - The data for the new session.
   * @returns {Promise<Object>} The created session data.
   */
  async scheduleSession(sessionData: {
    coach_id: string;
    student_id: string;
    court_id: string;
    start_time: string;
    end_time: string;
    session_type: 'individual' | 'group' | 'match_practice';
    notes?: string;
  }) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) throw new Error('Failed to schedule session');
    return response.json();
  },

  // Récupérer les sessions planifiées
  /**
   * Retrieves all scheduled sessions for a specific coach.
   * @param {string} coachId - The ID of the coach.
   * @returns {Promise<Array>} List of scheduled sessions.
   */
  async getSessions(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/sessions?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  // Mettre à jour une session
  /**
   * Updates existing training sessions.
   * @param {string[]} sessionIds - Array of session IDs to update.
   * @param {any} sessionData - The new data for the sessions.
   * @returns {Promise<Object>} The updated session data.
   */
  async updateSession(sessionIds: string[], sessionData: any) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ session_ids: sessionIds, ...sessionData })
    });
    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
  },

  // Supprimer une session
  /**
   * Deletes one or more training sessions.
   * @param {string[]} sessionIds - Array of session IDs to delete.
   * @returns {Promise<Object>} Result of the deletion.
   */
  async deleteSession(sessionIds: string[]) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/sessions?ids=${sessionIds.join(',')}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete session');
    return response.json();
  },

  // Récupérer les joueurs non assignés dans le même club
  /**
   * Retrieves players in a club who are not currently assigned to a coach.
   * @param {string} [clubId] - Optional club ID filter.
   * @returns {Promise<Array>} List of unassigned players.
   */
  async getUnassignedPlayers(clubId?: string) {
    const headers = await authHeaders();
    const url = clubId ? `${API_URL}/unassigned-players?clubId=${clubId}` : `${API_URL}/unassigned-players`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch unassigned players');
    return response.json();
  },

  // Assigner un élève au coach
  /**
   * Assigns a student to a coach.
   * @param {string} coachId - ID of the coach.
   * @param {string} studentId - ID of the student.
   * @returns {Promise<Object>} Result of the assignment.
   */
  async addStudent(coachId: string, studentId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ coachId, studentId })
    });
    if (!response.ok) throw new Error('Failed to add student');
    return response.json();
  },
  // Supprimer un élève du roster
  /**
   * Removes a student from a coach's roster.
   * @param {string} studentId - ID of the student to remove.
   * @returns {Promise<Object>} Result of the removal.
   */
  async removeStudent(studentId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students/${studentId}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to remove student');
    return response.json();
  }
};