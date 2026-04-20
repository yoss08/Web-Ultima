import { useState, useEffect } from "react";
import { Search, User as UserIcon, Loader2, UserPlus, ArrowRight } from "lucide-react";
import { coachService } from "../../services/CoachService";
import { useAuth } from "../../services/AuthContext";
import { Link } from "react-router";
import { useTheme } from "../../styles/useTheme";

export function StudentList() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      if (user) {
        try {
          setIsLoading(true);
          const data = await coachService.getMyStudents(user.id);
          setStudents(data || []);
        } catch (error) {
          console.error("Error loading students:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadStudents();
  }, [user]);

  // Filtrage dynamique des étudiants
  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground font-['Playfair_Display']">My Students</h1>
          <p className="text-muted-foreground text-sm">Manage and track your players performance.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Find a student..."
              className="w-full pl-12 pr-4 h-12 bg-card border border-border rounded-[16px] text-foreground focus:border-accent outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="h-12 px-4 bg-card border border-border rounded-[16px] text-foreground outline-none focus:border-accent">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="mt-4 text-muted-foreground">Retrieving your roster...</p>
        </div>
      ) : students.length === 0 ? (
        /* État vide si aucune assignation en base de données */
        <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-12 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="text-accent" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">No Students Assigned</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            You don't have any students linked to your profile yet. Please contact the administrator to assign players to your coaching dashboard.
          </p>
          <button className="mt-8 px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20">
            Contact Admin
          </button>
        </div>
      ) : (
        /* Grille des étudiants réels */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div 
                key={student.id} 
                className="bg-card p-6 rounded-[24px] border border-border hover:border-accent/50 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 overflow-hidden">
                    {student.avatar_url ? (
                      <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="text-accent" size={28} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                      {student.full_name}
                    </h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {student.account_type || 'Player'}
                      </span>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                        {student.skill_level || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase">Win Rate</p>
                    <p className="font-bold text-foreground">--%</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase">Sessions</p>
                    <p className="font-bold text-foreground">0</p>
                  </div>
                </div>

                <Link 
                  to={`/dashboard/coach/students/${student.id}`}
                  className="w-full mt-6 py-3 rounded-[14px] bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-accent/10"
                >
                  View Performance <ArrowRight size={16} />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              No students match your search "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}