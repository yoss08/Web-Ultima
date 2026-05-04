import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Users, MapPin, ChevronRight, Save, Zap, List, Plus, CheckCircle, Circle, History, Edit, Trash } from "lucide-react";
import { coachService } from "../../services/CoachService";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../services/AuthContext";
import { toast } from "react-hot-toast";

export function SessionScheduler() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'sessions'>('schedule');
  const [students, setStudents] = useState<any[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSessions, setFetchingSessions] = useState(false);
  
  const [formData, setFormData] = useState({
    court_id: "",
    date: new Date().toISOString().split('T')[0],
    start_time: "10:00",
    duration: 60, // Minutes
    session_type: "group",
    notes: "",
    drill_plan: ""
  });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [editingSessionIds, setEditingSessionIds] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
       coachService.getMyStudents(user.id).then(setStudents);
       adminService.getAllCourts().then(data => {
         if (Array.isArray(data)) {
           setCourts(data);
           if (data.length > 0) setFormData(prev => ({ ...prev, court_id: data[0].id }));
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

  useEffect(() => {
    if (user?.id && activeTab === 'sessions') {
      loadSessions();
    }
  }, [user, activeTab]);

  const loadSessions = async () => {
    if (!user?.id) return;
    setFetchingSessions(true);
    try {
      const data = await coachService.getSessions(user.id);
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Could not load your sessions");
    } finally {
      setFetchingSessions(false);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) return toast.error("Please select at least one student");
    if (!formData.court_id) return toast.error("Please select a court");
    setLoading(true);
    try {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(start.getTime() + formData.duration * 60 * 1000);

      if (editingSessionIds.length > 0) {
        await coachService.updateSession(editingSessionIds, {
          coach_id: user!.id,
          student_ids: selectedStudentIds,
          court_id: formData.court_id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          session_type: formData.session_type as any,
          notes: formData.notes,
          drill_plan: formData.drill_plan
        });
        toast.success("Training session updated!");
      } else {
        await coachService.scheduleSession({
          coach_id: user!.id,
          student_ids: selectedStudentIds,
          court_id: formData.court_id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          session_type: formData.session_type as any,
          notes: formData.notes,
          drill_plan: formData.drill_plan
        } as any);
        toast.success("Training session scheduled!");
      }
      setSelectedStudentIds([]);
      setEditingSessionIds([]);
      setFormData({
        court_id: courts.length > 0 ? courts[0].id : "",
        date: new Date().toISOString().split('T')[0],
        start_time: "10:00",
        duration: 60,
        session_type: "group",
        notes: "",
        drill_plan: ""
      });
      setActiveTab('sessions');
    } catch (error) {
      toast.error(editingSessionIds.length > 0 ? "Failed to update session" : "Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sessionGroup: any) => {
    const startDate = new Date(sessionGroup.start_time);
    const dateStr = startDate.getFullYear() + '-' + String(startDate.getMonth() + 1).padStart(2, '0') + '-' + String(startDate.getDate()).padStart(2, '0');
    const timeStr = String(startDate.getHours()).padStart(2, '0') + ':' + String(startDate.getMinutes()).padStart(2, '0');
    const endDate = new Date(sessionGroup.end_time);
    const durationMins = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    setFormData({
      court_id: sessionGroup.court_id || (courts.length > 0 ? courts[0].id : ""),
      date: dateStr,
      start_time: timeStr,
      duration: durationMins,
      session_type: sessionGroup.session_type,
      notes: sessionGroup.notes || "",
      drill_plan: ""
    });
    setSelectedStudentIds(sessionGroup.students.map((s: any) => s?.id).filter(Boolean));
    setEditingSessionIds(sessionGroup.session_ids);
    setActiveTab('schedule');
  };

  const handleDelete = async (sessionIds: string[]) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    setFetchingSessions(true);
    try {
      await coachService.deleteSession(sessionIds);
      toast.success("Session deleted");
      loadSessions();
    } catch (err) {
      toast.error("Failed to delete session");
      setFetchingSessions(false);
    }
  };

  const cancelEdit = () => {
    setEditingSessionIds([]);
    setFormData({
      court_id: courts.length > 0 ? courts[0].id : "",
      date: new Date().toISOString().split('T')[0],
      start_time: "10:00",
      duration: 60,
      session_type: "group",
      notes: "",
      drill_plan: ""
    });
    setSelectedStudentIds([]);
    setActiveTab('sessions');
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="font-['Poppins']">
          <h1 className="text-3xl font-bold text-foreground font-['Playfair_Display'] tracking-tight">Sessions</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage and schedule your training sessions.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50 backdrop-blur-sm self-start">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'schedule' 
                ? 'bg-accent text-accent-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {editingSessionIds.length > 0 ? <><Edit size={16} /> Edit Session</> : <><Plus size={16} /> Schedule</>}
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sessions' 
                ? 'bg-accent text-accent-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List size={16} /> My Sessions
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'schedule' ? (
          <motion.div
            key="schedule-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/5 font-['Poppins']">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sélection de l'élève */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span className="flex items-center gap-2"><Users size={14} className="text-accent" /> Students ({selectedStudentIds.length})</span>
                    <span className="text-accent/60 lowercase italic font-normal">Select one or more</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto p-4 bg-muted/30 border border-border rounded-2xl no-scrollbar">
                    {students.length === 0 && <p className="col-span-full text-xs text-muted-foreground italic py-4 text-center">No students found in your roster.</p>}
                    {students.map(s => (
                      <label 
                        key={s.id} 
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                          selectedStudentIds.includes(s.id) 
                            ? 'bg-accent/10 border-accent text-accent' 
                            : 'bg-background border-transparent text-muted-foreground hover:border-border shadow-sm'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => toggleStudent(s.id)}
                        />
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          selectedStudentIds.includes(s.id) ? 'bg-accent border-accent' : 'bg-muted border-border'
                        }`}>
                          {selectedStudentIds.includes(s.id) && <CheckCircle size={14} className="text-black" />}
                        </div>
                        <span className="text-sm font-bold truncate">{s.full_name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="text-accent" /> Court
                  </label>
                  <select 
                    required
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent appearance-none"
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
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent appearance-none"
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

              <div className="flex gap-4">
                {editingSessionIds.length > 0 && (
                  <button 
                    type="button"
                    onClick={cancelEdit}
                    className="w-full h-14 bg-muted text-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
                >
                  {loading ? (editingSessionIds.length > 0 ? "Updating..." : "Scheduling...") : <><Save size={20}/> {editingSessionIds.length > 0 ? "Update Session" : "Confirm Session"}</>}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="sessions-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {fetchingSessions ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Fetching your schedule...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="bg-card border border-border rounded-[32px] p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <CalendarIcon size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">No sessions found</h3>
                  <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">You haven't scheduled any training sessions yet.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Schedule Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {Object.values(sessions.reduce((acc: any, session: any) => {
                  const key = `${session.start_time}_${session.court_id}`;
                  if (!acc[key]) {
                    acc[key] = { ...session, students: [session.student], session_ids: [session.id] };
                  } else {
                    acc[key].students.push(session.student);
                    acc[key].session_ids.push(session.id);
                  }
                  return acc;
                }, {})).map((session: any) => {
                  const { date, time } = formatDateTime(session.start_time);
                  const isPast = new Date(session.start_time) < new Date();
                  
                  return (
                    <div 
                      key={session.id}
                      className={`group bg-card border border-border rounded-2xl p-5 flex items-center gap-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-black/5 relative overflow-hidden ${isPast ? 'opacity-75' : ''}`}
                    >
                      {/* Status indicator line */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPast ? 'bg-muted-foreground/30' : 'bg-accent'}`} />
                      
                      <div className="flex flex-col items-center justify-center min-w-[80px] py-2 bg-muted/50 rounded-xl border border-border/50">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">{date.split(' ')[0]}</span>
                        <span className="text-xl font-bold font-['Playfair_Display']">{date.split(' ')[1].replace(',', '')}</span>
                        <span className="text-[10px] font-bold text-accent">{time}</span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            session.session_type === 'individual' ? 'bg-blue-500/10 text-blue-500' : 
                            session.session_type === 'group' ? 'bg-purple-500/10 text-purple-500' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {session.session_type.replace('_', ' ')}
                          </span>
                          {isPast && <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><History size={10} /> Completed</span>}
                        </div>
                        <h4 className="font-bold text-foreground truncate flex items-center gap-2">
                          {session.students.map((s: any) => s?.full_name).join(", ") || 'Unknown Student'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-accent/60" /> {session.court?.name || 'No Court'}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-accent/60" /> {Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000)} min</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        {!isPast ? (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(session); }} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-accent" title="Edit Session">
                              <Edit size={18} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(session.session_ids); }} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500" title="Delete Session">
                              <Trash size={18} />
                            </button>
                          </>
                        ) : (
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-accent">
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}