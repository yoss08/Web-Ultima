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
          className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-[#39FF14]/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold dark:text-white font-['Playfair_Display'] flex items-center gap-3">
            <Video className="text-[#39FF14]" /> PersonaVision Library
          </h1>
          <p className="text-gray-500">Review AI-captured match footage and provide video feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VIDEO LIST */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold dark:text-white px-1">Feed</h3>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-[#39FF14]" />
            </div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center bg-white/5 rounded-[24px] border border-dashed border-white/10">
              <p className="text-sm text-gray-500 italic">No videos recorded yet.</p>
            </div>
          ) : (
            videos.map(video => (
              <div 
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`p-4 rounded-[24px] border transition-all cursor-pointer flex gap-4 ${
                  selectedVideo?.id === video.id 
                  ? "bg-[#39FF14]/5 border-[#39FF14]/30" 
                  : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-gray-200"
                }`}
              >
                <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-white/10 overflow-hidden relative flex-shrink-0">
                  <img src={video.thumbnail || "https://images.unsplash.com/photo-1595435064219-c48ec448983e?auto=format&fit=crop&w=300&q=80"} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                </div>
                <div className="space-y-1 py-1">
                  <h4 className="font-bold dark:text-white text-sm line-clamp-1">{video.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <User size={10} /> {video.student_name || "Unknown Student"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
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
              <div className="aspect-video rounded-[32px] bg-black border border-white/10 overflow-hidden relative group">
                  <img src={selectedVideo.thumbnail} alt="" className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-[#39FF14] text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.5)] cursor-pointer hover:scale-110 transition-transform">
                        <Play size={40} className="ml-1 fill-black" />
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-xs font-mono">02:15 / {selectedVideo.duration}</span>
                     <div className="flex gap-4">
                        <Bookmark size={18} className="cursor-pointer hover:text-[#39FF14]" />
                        <Share2 size={18} className="cursor-pointer hover:text-[#39FF14]" />
                     </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">Video Feedback</h3>
                    <p className="text-sm text-gray-500">Annotate key moments in the video.</p>
                  </div>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold dark:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    <Type size={14} /> Add Overlay
                  </button>
                </div>
                
                <textarea 
                  className="w-full h-32 p-4 bg-gray-50 dark:bg-black/20 border border-transparent focus:border-[#39FF14] rounded-2xl outline-none text-sm dark:text-white resize-none"
                  placeholder="Timestamp 02:10 - Note: Student's elbow is too low during the take-back..."
                />
                <button className="w-full mt-4 h-12 bg-[#39FF14] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <MessageSquare size={18} /> Send Annotation to Student
                </button>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[32px] text-center p-12">
               <div className="p-6 rounded-full bg-white/5 mb-6">
                  <Video size={48} className="text-gray-400" />
               </div>
               <h3 className="text-xl font-bold dark:text-white">Select a video to begin review</h3>
               <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">Access AI-tracked match analysis and provide targeted technical feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
