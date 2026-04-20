const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const coachService = {
  // Récupérer les statistiques du dashboard
  async getStats(coachId: string) {
    const response = await fetch(`${API_URL}/coach/stats?coachId=${coachId}`);
    if (!response.ok) throw new Error('Failed to fetch coach stats');
    return response.json();
  },
  // Récupérer la liste des élèves assignés au coach
  async getMyStudents(coachId: string) {
    const response = await fetch(`${API_URL}/coach/students?coachId=${coachId}`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  // Récupérer les stats et l'historique d'un élève
  async getStudentStats(studentId: string) {
    const response = await fetch(`${API_URL}/coach/students/${studentId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch student stats');
    return response.json();
  },

  // Récupérer la bibliothèque vidéo
  async getVideoLibrary(coachId: string) {
    const response = await fetch(`${API_URL}/coach/video-library?coachId=${coachId}`);
    if (!response.ok) throw new Error('Failed to fetch video library');
    return response.json();
  },

  // Récupérer les recommandations IA
  async getRecommendations(coachId: string) {
    const response = await fetch(`${API_URL}/coach/recommendations?coachId=${coachId}`);
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
    const response = await fetch(`${API_URL}/coach/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) throw new Error('Failed to schedule session');
    return response.json();
  }
};