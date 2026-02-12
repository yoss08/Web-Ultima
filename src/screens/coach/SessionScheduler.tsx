import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ChevronRight, Save } from "lucide-react";
import { coachService } from "../../services/CoachService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

export function SessionScheduler() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: "",
    court_id: "court-1", // Par défaut
    date: new Date().toISOString().split('T')[0],
    start_time: "10:00",
    session_type: "individual",
    notes: ""
  });

  useEffect(() => {
    if (user) coachService.getMyStudents(user.id).then(setStudents);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 heure par défaut

      await coachService.scheduleSession({
        coach_id: user!.id,
        student_id: formData.student_id,
        court_id: formData.court_id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        session_type: formData.session_type as any,
        notes: formData.notes
      });
      toast.success("Training session scheduled!");
    } catch (error) {
      toast.error("Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold dark:text-white font-['Playfair_Display']">Schedule Training</h1>
        <p className="text-gray-500 text-sm">Create a new session with your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-[24px] p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection de l'élève */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <Users size={16} className="text-[#39FF14]" /> Student
            </label>
            <select 
              required
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
              onChange={(e) => setFormData({...formData, student_id: e.target.value})}
            >
              <option value="">Select a student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>

          {/* Type de session */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <MapPin size={16} className="text-[#39FF14]" /> Session Type
            </label>
            <select 
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
              onChange={(e) => setFormData({...formData, session_type: e.target.value})}
            >
              <option value="individual">Individual Coaching</option>
              <option value="group">Group Clinic</option>
              <option value="match_practice">Match Practice</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <CalendarIcon size={16} className="text-[#39FF14]" /> Date
            </label>
            <input 
              type="date"
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-[#39FF14]" /> Start Time
            </label>
            <input 
              type="time"
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white"
              value={formData.start_time}
              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold dark:text-white">Training Notes / Focus Areas</label>
          <textarea 
            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl dark:text-white h-32 outline-none focus:border-[#39FF14]"
            placeholder="e.g. Work on backhand consistency and serve placement..."
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full h-14 bg-[#39FF14] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Scheduling..." : <><Save size={20}/> Confirm Session</>}
        </button>
      </form>
    </div>
  );
}