import { useState, useEffect } from "react";
import { 
  Video, 
  Play, 
  MessageSquare, 
  Share2, 
  Bookmark,
  ChevronLeft,
  Clock,
  User,
  Type,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../services/AuthContext";
import { coachService } from "../../services/CoachService";

export function VideoReviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      coachService.getVideoLibrary(user.id)
        .then(setVideos)
        .catch(err => console.error("Error fetching videos:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-muted hover:bg-accent/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-['Playfair_Display'] flex items-center gap-3">
            <Video className="text-accent" /> PersonaVision Library
          </h1>
          <p className="text-muted-foreground font-['Poppins']">Review AI-captured match footage and provide video feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VIDEO LIST */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-foreground px-1 font-['Playfair_Display'] text-xl">Feed</h3>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-accent" />
            </div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center bg-muted/30 rounded-[24px] border border-dashed border-border text-foreground font-['Poppins']">
              <p className="text-sm text-muted-foreground italic">No videos recorded yet.</p>
            </div>
          ) : (
            videos.map(video => (
              <div 
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`p-4 rounded-[24px] border transition-all cursor-pointer flex gap-4 font-['Poppins'] ${
                  selectedVideo?.id === video.id 
                    ? "bg-accent/5 border-accent shadow-lg shadow-accent/5" 
                    : "bg-card border-border hover:border-accent hover:shadow-md"
                }`}
              >
                <div className="w-24 h-24 rounded-2xl bg-muted overflow-hidden relative flex-shrink-0">
                  <img src={video.thumbnail || "https://images.unsplash.com/photo-1595435064219-c48ec448983e?auto=format&fit=crop&w=300&q=80"} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                </div>
                <div className="space-y-1 py-1">
                  <h4 className="font-bold text-foreground text-sm line-clamp-1 font-['Playfair_Display']">{video.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <User size={10} className="text-accent" /> {video.student_name || "Unknown Student"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                    <Clock size={10} /> {video.duration} • {new Date(video.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PLAYER & ANNOTATIONS */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVideo ? (
            <>
              <div className="aspect-video rounded-[32px] bg-black border border-border overflow-hidden relative group">
                  <img src={selectedVideo.thumbnail} alt="" className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300">
                        <Play size={40} className="ml-1 fill-accent-foreground" />
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 font-['Poppins']">
                     <span className="text-xs font-mono">02:15 / {selectedVideo.duration}</span>
                     <div className="flex gap-4">
                        <Bookmark size={18} className="cursor-pointer hover:text-accent transition-colors" />
                        <Share2 size={18} className="cursor-pointer hover:text-accent transition-colors" />
                     </div>
                  </div>
              </div>

              <div className="bg-card border border-border rounded-[32px] p-8">
                <div className="flex justify-between items-start mb-6 font-['Poppins']">
                  <div>
                    <h3 className="text-xl font-bold text-foreground font-['Playfair_Display'] text-2xl">Video Feedback</h3>
                    <p className="text-sm text-muted-foreground">Annotate key moments in the video.</p>
                  </div>
                  <button className="px-4 py-2 bg-muted border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted/80 transition-all flex items-center gap-2">
                    <Type size={14} className="text-accent" /> Add Overlay
                  </button>
                </div>
                
                <textarea 
                  className="w-full h-32 p-4 bg-muted border border-transparent focus:border-accent rounded-2xl outline-none text-sm text-foreground resize-none font-['Poppins'] transition-all shadow-inner"
                  placeholder="Timestamp 02:10 - Note: Student's elbow is too low during the take-back..."
                />
                <button className="w-full mt-4 h-14 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20">
                  <MessageSquare size={18} /> Send Annotation to Student
                </button>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed border-border rounded-[32px] text-center p-12 font-['Poppins']">
               <div className="p-6 rounded-full bg-muted mb-6 shadow-inner">
                  <Video size={48} className="text-muted-foreground/30" />
               </div>
               <h3 className="text-xl font-bold text-foreground font-['Playfair_Display'] text-2xl">Select a video to begin review</h3>
               <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm italic">Access AI-tracked match analysis and provide targeted technical feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
