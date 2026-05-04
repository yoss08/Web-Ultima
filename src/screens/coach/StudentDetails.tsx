import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { Star, Send, ChevronLeft, Loader2, Activity } from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { coachService } from "../../services/CoachService";
import { useSocket } from "../../hooks/useSocket";

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { socket } = useSocket();

  // État pour le nouveau feedback
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);

  // Private coach notes (persistent, separate from evaluation)
  const [privateNotes, setPrivateNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await coachService.getStudentStats(id);
        setStudent(data.profile);

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
      <Loader2 className="animate-spin text-accent" size={40} />
      <p className="text-muted-foreground">Loading student profile...</p>
    </div>
  );

  const handleSubmitEvaluation = async () => {
  if (!note.trim()) return toast.error("Please add a note");
  setSubmitting(true);

  try {
    const { data, error } = await supabase
      .from('coach_feedbacks')
      .insert([{
        student_id: id,
        coach_id: user?.id,
        content: note,
        rating: rating,
      }])
      .select();

    if (error) throw error;
    
    const feedback = data?.[0];

    // Send real-time notification via Socket.io
    socket.emit('send-feedback-notification', { 
      studentId: id, 
      coachName: user?.user_metadata?.full_name || 'your coach' 
    });

    if (feedback) {
      await supabase.from('notifications').insert([{
        user_id: id,
        type: 'coach_feedback',
        message: `Coach ${user?.user_metadata?.full_name || 'your coach'} has added new feedback for you.`,
        related_entity_id: feedback.id,
        related_entity_type: 'feedback',
        read: false
      }]);
    }

    toast.success("Feedback updated!");
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
          className="p-3 rounded-full bg-muted hover:bg-accent/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate max-w-[200px] sm:max-w-none font-['Playfair_Display']">{student?.full_name}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground italic font-['Poppins']">Student Performance Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : FORMULAIRE FEEDBACK */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card border border-border rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground font-['Playfair_Display']">
              <Star className="text-accent" size={22} />
              Technical Evaluation
            </h3>
            
            <div className="space-y-4 font-['Poppins']">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Training Notes</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Analyze the student's progress, strengths, and weaknesses..."
                className="w-full h-48 p-4 rounded-2xl bg-muted border border-transparent focus:border-accent outline-none transition-all resize-none text-sm text-foreground shadow-inner"
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-border font-['Poppins']">
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium mr-2 text-foreground">Session Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className="hover:scale-110 transition-transform">
                       <Star size={24} fill={s <= rating ? "var(--theme-accent)" : "none"} className={s <= rating ? "text-accent" : "text-muted-foreground/30"} />
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleSubmitEvaluation}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
                >
                  {submitting ? "Saving..." : "Save Evaluation"}
                  <Send size={18} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : MISE À JOUR DES SCORES (SKILLS) */}
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground font-['Playfair_Display']">
              📝 Private Notes
            </h3>
            <p className="text-[11px] text-muted-foreground mb-3 font-['Poppins']">Only visible to you. Not shared with the student.</p>
            <textarea
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Write private observations about this student..."
              className="w-full h-32 p-4 rounded-2xl bg-muted border border-transparent focus:border-accent outline-none transition-all resize-none text-sm text-foreground font-['Poppins'] shadow-inner"
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
              className="mt-3 w-full py-2.5 bg-accent/10 text-accent font-bold rounded-xl text-sm hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </section>
        </div>

      </div>
    </div>
  );
}