import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../../services/AuthContext";
import { 
  TrendingUp, Target, BarChart2, Star, Send, 
  ChevronLeft, Loader2, User, Award, Activity 
} from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

export function StudentDetails() {
  const { id } = useParams(); // ID de l'élève
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // État pour le nouveau feedback
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);

  // État pour les scores techniques (Skills)
  const [skills, setSkills] = useState({
    speed: 50,
    power: 50,
    technique: 50,
    stamina: 50,
    mental: 50
  });
  useEffect(() => {
  async function fetchStudentData() {
    // 1. On s'assure que l'ID existe avant de faire quoi que ce soit
    if (!id) {
      console.error("ID manquant dans l'URL");
      return;
    }

    try {
      setLoading(true);
      console.log("Chargement des données pour l'étudiant ID:", id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // maybeSingle est plus stable que single() pour éviter les erreurs 406

      if (error) throw error;

      if (!data) {
        console.warn("Aucun étudiant trouvé avec cet ID");
        toast.error("Student not found");
        // On ne redirige que si on est SÛR que l'étudiant n'existe pas
        return; 
      }

      setStudent(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération de l'étudiant:", err.message);
     
    } finally {
      setLoading(false);
    }
  }

  fetchStudentData();
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
        </div>

        {/* COLONNE DROITE : MISE À JOUR DES SCORES (SKILLS) */}
        <div className="space-y-6">
          <section className="bg-[#0A0E1A] text-white rounded-[32px] p-8 border border-white/10">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
              <Activity className="text-[#39FF14]" size={20} />
              Update Skills
            </h3>
            
            <div className="space-y-8">
              {Object.entries(skills).map(([skill, value]) => (
                <div key={skill} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{skill}</span>
                    <span className="text-[#39FF14] font-mono font-bold">{value}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={value}
                    onChange={(e) => setSkills({...skills, [skill]: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#39FF14]/10 rounded-2xl border border-[#39FF14]/20">
              <p className="text-[11px] text-[#39FF14] font-medium leading-relaxed">
                Updating these values will immediately refresh the histogram on the student's analytics dashboard.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}