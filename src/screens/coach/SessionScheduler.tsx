import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ChevronRight, Save, Zap } from "lucide-react";
import { coachService } from "../../services/CoachService";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

export function SessionScheduler() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: "",
    court_id: "",
    date: new Date().toISOString().split('T')[0],
    start_time: "10:00",
    duration: 60, // Minutes
    session_type: "individual",
    notes: "",
    drill_plan: ""
  });

  useEffect(() => {
    if (user?.id) {
       coachService.getMyStudents(user.id).then(setStudents);
       adminService.getAllCourts().then(data => {
         if (Array.isArray(data)) {
           setCourts(data);
         } else {
           console.error("Courts data is not an array:", data);
           setCourts([]);
         }
       }).catch(err => {
         console.error("Failed to fetch courts:", err);
         setCourts([]);
       });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.court_id) return toast.error("Please select a court");
    setLoading(true);
    try {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(start.getTime() + formData.duration * 60 * 1000);

      await coachService.scheduleSession({
        coach_id: user!.id,
        student_id: formData.student_id,
        court_id: formData.court_id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        session_type: formData.session_type as any,
        notes: formData.notes,
        drill_plan: formData.drill_plan
      } as any);
      toast.success("Training session scheduled!");
    } catch (error) {
      toast.error("Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="font-['Poppins']">
        <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Schedule Training</h1>
        <p className="text-muted-foreground text-sm font-medium">Create a new session with your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[24px] p-6 sm:p-8 space-y-6 shadow-sm font-['Poppins']">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection de l'élève */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Users size={14} className="text-accent" /> Student
            </label>
            <select 
              required
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent"
              onChange={(e) => setFormData({...formData, student_id: e.target.value})}
            >
              <option value="">Select a student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-accent" /> Court
            </label>
            <select 
              required
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent"
              onChange={(e) => setFormData({...formData, court_id: e.target.value})}
              value={formData.court_id}
            >
              <option value="">Select a court</option>
              {courts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-accent" /> Session Type
            </label>
            <select 
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent"
              onChange={(e) => setFormData({...formData, session_type: e.target.value})}
              value={formData.session_type}
            >
              <option value="individual">Individual Coaching</option>
              <option value="group">Group Clinic</option>
              <option value="match_practice">Match Practice</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon size={14} className="text-accent" /> Date
            </label>
            <input 
              type="date"
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-accent" /> Start
              </label>
              <input 
                type="time"
                className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground font-mono"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-accent" /> Duration (min)
              </label>
              <input 
                type="number"
                min="30"
                step="15"
                className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Detailed session plan / Drills</label>
          <textarea 
            className="w-full p-4 bg-muted border border-border rounded-xl text-foreground h-24 outline-none focus:border-accent resize-none transition-all shadow-inner"
            placeholder="Focus on backhand cross-court drills and first serve percentage..."
            value={formData.drill_plan}
            onChange={(e) => setFormData({...formData, drill_plan: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Private Coach Notes</label>
          <textarea 
            className="w-full p-4 bg-muted border border-border rounded-xl text-foreground h-24 outline-none focus:border-accent resize-none transition-all shadow-inner"
            placeholder="Student seems tired today, keep intensity moderate..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
        >
          {loading ? "Scheduling..." : <><Save size={20}/> Confirm Session</>}
        </button>
      </form>
    </div>
  );
}