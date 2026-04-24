import { supabase } from '../config/supabase';
import { COACH_API as API_URL } from '../config/apiConfig';

async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated. Please log in again.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export const coachService = {
  // Récupérer les statistiques du dashboard
  async getStats(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/stats?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch coach stats');
    return response.json();
  },
  // Récupérer la liste des élèves assignés au coach
  async getMyStudents(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  // Récupérer les stats et l'historique d'un élève
  async getStudentStats(studentId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students/${studentId}/stats`, { headers });
    if (!response.ok) throw new Error('Failed to fetch student stats');
    return response.json();
  },

  // Récupérer la bibliothèque vidéo
  async getVideoLibrary(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/video-library?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch video library');
    return response.json();
  },

  // Récupérer les recommandations IA
  async getRecommendations(coachId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/recommendations?coachId=${coachId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  // Planifier une nouvelle session d'entraînement
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

  // Récupérer les joueurs non assignés dans le même club
  async getUnassignedPlayers(clubId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/unassigned-players?clubId=${clubId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch unassigned players');
    return response.json();
  },

  // Assigner un élève au coach
  async addStudent(coachId: string, studentId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ coachId, studentId })
    });
    if (!response.ok) throw new Error('Failed to add student');
    return response.json();
  }
};