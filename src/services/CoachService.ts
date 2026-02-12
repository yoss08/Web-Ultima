import { supabase } from '../config/supabase';

export const coachService = {
  // Récupérer la liste des élèves assignés au coach [cite: 246]
  async getMyStudents(coachId: string) {
    const { data, error } = await supabase
      .from('coach_students')
      .select(`
        student_id,
        profiles:student_id (id, full_name, avatar_url, account_type)
      `)
      .eq('coach_id', coachId);
    if (error) throw error;
    return data.map(item => item.profiles);
  },

  // Planifier une nouvelle session d'entraînement [cite: 262]
  async scheduleSession(sessionData: {
    coach_id: string;
    student_id: string;
    court_id: string;
    start_time: string;
    end_time: string;
    session_type: 'individual' | 'group' | 'match_practice';
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([sessionData]);
    if (error) throw error;
    return data;
  }
};