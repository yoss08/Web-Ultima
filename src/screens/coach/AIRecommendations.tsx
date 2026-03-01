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
            className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-[#39FF14]/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold dark:text-white font-['Playfair_Display'] flex items-center gap-3">
              <Sparkles className="text-purple-400" /> AI Coach Assistant
            </h1>
            <p className="text-gray-500">Intelligent training insights derived from match performance data.</p>
          </div>
        </div>
        <button 
          onClick={handleGenerateAnalysis}
          className="px-6 py-3 bg-[#39FF14] text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#39FF14]/20"
        >
          {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
          Generate New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* OVERVIEW CARDS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-[32px]">
               <h4 className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">Analysis Coverage</h4>
               <p className="text-3xl font-bold dark:text-white">{loading ? "..." : "85%"}</p>
               <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[85%] h-full bg-purple-400" />
               </div>
            </div>
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-[32px]">
               <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Drill Completion</h4>
               <p className="text-3xl font-bold dark:text-white">{loading ? "..." : "12/20"}</p>
               <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[60%] h-full bg-blue-400" />
               </div>
            </div>
            <div className="p-6 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-[32px]">
               <h4 className="text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-2">Avg Improvement</h4>
               <p className="text-3xl font-bold dark:text-white">{loading ? "..." : "+8.2%"}</p>
               <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="w-[75%] h-full bg-[#39FF14]" />
               </div>
            </div>
        </div>

        {/* RECOMMENDATION FEED */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Target className="text-[#39FF14]" size={22} /> Suggested Focus Areas
          </h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-[#39FF14]" size={40} />
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-[32px]">
                <p className="text-gray-500 italic">No AI recommendations available yet. Try generating a new analysis!</p>
              </div>
            ) : (
              recommendations.map(rec => (
                <div key={rec.id} className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] group hover:border-purple-500/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-white/5 text-gray-400 px-2 py-1 rounded">Intensity: {rec.intensity}</span>
                        <h4 className="text-lg font-bold dark:text-white mt-2">Drill: {rec.drill}</h4>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">Impact</span>
                         <span className="text-sm font-bold dark:text-white">{rec.impact}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl mb-6">
                       <p className="text-xs text-gray-500 leading-relaxed italic">
                          {rec.description || `Based on the latest data, ${rec.student_name} needs to focus on ${rec.weakness}.`}
                       </p>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
                          <span className="text-sm font-bold dark:text-white">{rec.student_name}</span>
                       </div>
                       <button className="flex items-center gap-2 text-sm font-bold text-[#39FF14] group-hover:translate-x-1 transition-transform">
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
           <section className="p-8 bg-black dark:bg-black border border-white/10 rounded-[32px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={120} />
              </div>
              <h3 className="text-white font-bold text-xl mb-4 relative z-10">Trend Alert</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                AI has detected a recurring pattern: your students perform 12% better on courts with <b>Hard</b> surfaces when using <b>Top-spin</b> heavy strategies.
              </p>
              <button className="w-full h-12 bg-white text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-all relative z-10">
                 View Data Source <TrendingUp size={16} />
              </button>
           </section>

           <section className="p-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px]">
              <h3 className="text-lg font-bold dark:text-white mb-6">Analysis Queue</h3>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-gray-400" size={16} />
                        <span className="text-xs dark:text-gray-300">Match #{100+i} processed</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">OK</span>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
