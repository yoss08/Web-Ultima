import { useState, useEffect } from "react";
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { coachService } from "../../services/CoachService";

export function AIRecommendations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      coachService.getRecommendations(user.id)
        .then(setRecommendations)
        .catch(err => console.error("Error fetching recommendations:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleGenerateAnalysis = () => {
    setAnalyzing(true);
    // In a real app, this might trigger a background AI process via API
    setTimeout(() => {
      setAnalyzing(false);
      // Refresh after "analysis"
      if (user?.id) coachService.getRecommendations(user.id).then(setRecommendations);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-muted hover:bg-accent/10 transition-colors"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-['Playfair_Display'] flex items-center gap-3">
              <Sparkles className="text-accent" /> AI Coach Assistant
            </h1>
            <p className="text-muted-foreground font-['Poppins'] font-medium">Intelligent training insights derived from match performance data.</p>
          </div>
        </div>
        <button 
          onClick={handleGenerateAnalysis}
          className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent/20"
        >
          {analyzing ? <Loader2 className="animate-spin text-accent-foreground" size={20} /> : <Brain size={20} className="text-accent-foreground" />}
          Generate New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* OVERVIEW CARDS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-[32px] font-['Poppins'] shadow-sm">
               <h4 className="text-accent/60 text-[10px] font-bold uppercase tracking-widest mb-2">Analysis Coverage</h4>
               <p className="text-3xl font-bold text-foreground">{loading ? "..." : "85%"}</p>
               <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[85%] h-full bg-accent shadow-[0_0_10px_var(--theme-accent)]" />
               </div>
            </div>
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-[32px] font-['Poppins'] shadow-sm">
               <h4 className="text-accent/60 text-[10px] font-bold uppercase tracking-widest mb-2">Drill Completion</h4>
               <p className="text-3xl font-bold text-foreground">{loading ? "..." : "12/20"}</p>
               <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[60%] h-full bg-accent shadow-[0_0_10px_var(--theme-accent)]" />
               </div>
            </div>
            <div className="p-6 bg-accent/10 border border-accent/20 rounded-[32px] font-['Poppins'] shadow-md shadow-accent/5">
               <h4 className="text-accent text-[10px] font-bold uppercase tracking-widest mb-2">Avg Improvement</h4>
               <p className="text-3xl font-bold text-foreground">{loading ? "..." : "+8.2%"}</p>
               <div className="w-full bg-muted h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[75%] h-full bg-accent shadow-[0_0_10px_var(--theme-accent)]" />
               </div>
            </div>
        </div>

        {/* RECOMMENDATION FEED */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 font-['Playfair_Display']">
            <Target className="text-accent" size={22} /> Suggested Focus Areas
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-accent" size={40} />
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-12 text-center bg-muted/30 border border-dashed border-border rounded-[32px]">
                <p className="text-muted-foreground italic">No AI recommendations available yet. Try generating a new analysis!</p>
              </div>
            ) : (
              recommendations.map(rec => (
                <div key={rec.id} className="p-6 bg-card border border-border rounded-[32px] group hover:border-accent/30 transition-all font-['Poppins'] shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-accent/10 text-accent px-2 py-1 rounded">Intensity: {rec.intensity}</span>
                        <h4 className="text-lg font-bold text-foreground mt-2 font-['Playfair_Display']">Drill: {rec.drill}</h4>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] text-accent font-bold uppercase block mb-1">Impact</span>
                         <span className="text-sm font-bold text-foreground">{rec.impact}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-2xl mb-6">
                       <p className="text-xs text-muted-foreground leading-relaxed italic">
                          {rec.description || `Based on the latest data, ${rec.student_name} needs to focus on ${rec.weakness}.`}
                       </p>
                    </div>

                     <div className="flex items-center justify-between font-['Poppins']">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs border border-accent/20">
                              {rec.student_name?.[0]}
                           </div>
                           <span className="text-sm font-bold text-foreground">{rec.student_name}</span>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">
                           Assign to Student <ArrowRight size={16} />
                        </button>
                     </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI INSIGHTS SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
           <section className="p-8 bg-card border border-border rounded-[32px] shadow-2xl relative overflow-hidden font-['Poppins']">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={120} className="text-accent" />
              </div>
              <h3 className="text-foreground font-bold text-xl mb-4 relative z-10 font-['Playfair_Display']">Trend Alert</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative z-10">
                AI has detected a recurring pattern: your students perform 12% better on courts with <b>Hard</b> surfaces when using <b>Top-spin</b> heavy strategies.
              </p>
              <button className="w-full h-12 bg-accent text-accent-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all relative z-10 shadow-lg shadow-accent/20">
                 View Data Source <TrendingUp size={16} />
              </button>
           </section>

           <section className="p-8 bg-card border border-border rounded-[32px] shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6 font-['Playfair_Display']">Analysis Queue</h3>
              <div className="space-y-4 font-['Poppins']">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted border border-border/50 group/item hover:border-accent/30 transition-all">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-accent" size={16} />
                        <span className="text-xs text-muted-foreground group-hover/item:text-foreground transition-colors">Match #{100+i} processed</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">OK</span>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
