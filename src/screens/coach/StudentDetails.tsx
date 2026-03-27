import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { Star, Send, ChevronLeft, Loader2, Activity } from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { coachService } from "../../services/CoachService";
import { useSocket } from "../../hooks/useSocket";

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { socket } = useSocket();

  // État pour le nouveau feedback
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);

  // Private coach notes (persistent, separate from evaluation)
  const [privateNotes, setPrivateNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // État pour les scores techniques (Skills)
  const [skills, setSkills] = useState({
    speed: 50,
    power: 50,
    technique: 50,
    stamina: 50,
    mental: 50
  });

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await coachService.getStudentStats(id);
        setStudent(data.profile);
        setMatches(data.matches);
        setTrend(data.performanceTrend);
        
        // Update sliders if latest trend exists
        if (data.performanceTrend.length > 0) {
          const latest = data.performanceTrend[data.performanceTrend.length - 1];
          setSkills({
            speed: latest.speed || 50,
            power: latest.power || 50,
            technique: latest.technique || 50,
            stamina: latest.stamina || 50,
            mental: latest.mental || 50
          });
        }

        // Load private notes
        if (user?.id) {
          const { data: notesData } = await supabase
            .from('coach_notes')
            .select('content')
            .eq('student_id', id)
            .eq('coach_id', user.id)
            .single();
          if (notesData) setPrivateNotes(notesData.content || '');
        }
      } catch (err) {
        console.error("Error loading student data:", err);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);  

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="animate-spin text-[#39FF14]" size={40} />
      <p className="text-gray-500">Loading student profile...</p>
    </div>
  );

  const handleSubmitEvaluation = async () => {
  if (!note.trim()) return toast.error("Please add a note");
  setSubmitting(true);

  try {
    const { error } = await supabase
      .from('coach_feedbacks')
      .insert([{
        student_id: id, // L'ID de l'élève récupéré par useParams
        coach_id: user?.id,
        content: note,
        rating: rating,
        // On envoie les valeurs des sliders
        speed: skills.speed,
        power: skills.power,
        technique: skills.technique,
        stamina: skills.stamina,
        mental: skills.mental
      }]);

    if (error) throw error;
    
    // Send real-time notification via Socket.io
    socket.emit('send-feedback-notification', { 
      studentId: id, 
      coachName: user?.user_metadata?.full_name || 'your coach' 
    });

    toast.success("Feedback and Skills updated!");
    setNote(""); // On vide le champ texte
  } catch (err) {
    toast.error("Error saving data");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header avec retour */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-[#39FF14]/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{student?.full_name}</h1>
          <p className="text-gray-500 italic">Student Performance Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : FORMULAIRE FEEDBACK */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-[#39FF14]" size={22} />
              Technical Evaluation
            </h3>
            
            <div className="space-y-4">
              <label className="text-sm font-bold opacity-60 uppercase tracking-widest">Training Notes</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Analyze the student's progress, strengths, and weaknesses..."
                className="w-full h-40 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-transparent focus:border-[#39FF14] outline-none transition-all resize-none text-sm"
              />
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium mr-2">Session Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star size={24} fill={s <= rating ? "#FFD700" : "none"} className={s <= rating ? "text-[#FFD700]" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleSubmitEvaluation}
                  disabled={submitting}
                  className="bg-[#39FF14] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Evaluation"}
                  <Send size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* PERFORMANCE CHART */}
          <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-blue-400" size={22} />
              Progress Over Time
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888888" vertical={false} opacity={0.1} />
                  <XAxis dataKey="created_at" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px' }}
                    labelFormatter={(str) => new Date(str).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="technique" stroke="#39FF14" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                  <Area type="monotone" dataKey="power" stroke="#FFD700" fillOpacity={0} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* MATCH HISTORY */}
          <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-6">Recent Matches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10">
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {matches.map((m: any, i: number) => (
                    <tr key={i}>
                      <td className="py-4 text-sm dark:text-gray-300">{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="py-4 font-mono font-bold dark:text-white">{m.score || "6-4, 3-6, 7-5"}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${m.winner_id === id ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {m.winner_id === id ? 'Victory' : 'Defeat'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : MISE À JOUR DES SCORES (SKILLS) */}
        <div className="space-y-6">
          {/* PRIVATE NOTES SECTION */}
          <section className="bg-white dark:bg-white/5 text-slate-900 dark:text-white rounded-[32px] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              📝 Private Notes
            </h3>
            <p className="text-[11px] opacity-40 mb-3">Only visible to you. Not shared with the student.</p>
            <textarea
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Write private observations about this student..."
              className="w-full h-32 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-transparent focus:border-[#FFD700] outline-none transition-all resize-none text-sm"
            />
            <button
              onClick={async () => {
                if (!user?.id || !id) return;
                setSavingNotes(true);
                try {
                  const { error } = await supabase
                    .from('coach_notes')
                    .upsert({ student_id: id, coach_id: user.id, content: privateNotes, updated_at: new Date().toISOString() }, { onConflict: 'student_id,coach_id' });
                  if (error) throw error;
                  toast.success('Notes saved');
                } catch { toast.error('Failed to save notes'); }
                finally { setSavingNotes(false); }
              }}
              disabled={savingNotes}
              className="mt-3 w-full py-2.5 bg-[#FFD700]/10 text-[#FFD700] font-bold rounded-xl text-sm hover:bg-[#FFD700]/20 transition-colors disabled:opacity-50"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </section>
          <section className="bg-white dark:bg-white/5 text-slate-900 dark:text-white rounded-[32px] p-8 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Activity className="text-[#39FF14]" size={20} />
              Update Skills
            </h3>
            
            <div className="space-y-8">
              {Object.entries(skills).map(([skill, value]) => (
                <div key={skill} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-tighter text-slate-500 dark:text-white/70">{skill}</span>
                    <span className="text-[#39FF14] font-mono font-bold">{value}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={value}
                    onChange={(e) => setSkills({...skills, [skill]: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#39FF14] transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#39FF14]/10 rounded-2xl border border-[#39FF14]/20">
              <p className="text-[11px] text-[#2ebd10] dark:text-[#39FF14] font-medium leading-relaxed">
                Updating these values will immediately refresh the histogram on the student's analytics dashboard.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}