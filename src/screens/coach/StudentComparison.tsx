import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Loader2, BarChart3, ArrowLeft, X
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend
} from "recharts";
import { Link } from "react-router";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../services/AuthContext";

interface Student {
  id: string;
  full_name: string;
  role: string;
  speed?: number;
  power?: number;
  technique?: number;
  stamina?: number;
  mental?: number;
  matches_played?: number;
  wins?: number;
}

const COLORS = ["#CCFF00", "#00E5FF", "#C084FC", "#F43F5E"];

export function StudentComparison() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, [user]);

  async function fetchStudents() {
    try {
      // Fetch all students (players) with their latest feedback scores
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("role", "player");

      if (!profiles) return;

      // Fetch latest feedback for each student
      const studentsWithStats = await Promise.all(
        profiles.map(async (p) => {
          const { data: fb } = await supabase
            .from("coach_feedbacks")
            .select("speed, power, technique, stamina, mental")
            .eq("student_id", p.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const { count: matchCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id);

          const { count: winCount } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id)
            .eq("result", "Win");

          const latestFb = fb?.[0];
          return {
            ...p,
            speed: latestFb?.speed || 0,
            power: latestFb?.power || 0,
            technique: latestFb?.technique || 0,
            stamina: latestFb?.stamina || 0,
            mental: latestFb?.mental || 0,
            matches_played: matchCount || 0,
            wins: winCount || 0,
          };
        })
      );

      setStudents(studentsWithStats);
    } finally {
      setLoading(false);
    }
  }

  const toggleStudent = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedStudents = students.filter((s) => selected.includes(s.id));

  // Build radar data
  const radarData = ["Speed", "Power", "Technique", "Stamina", "Mental"].map((skill) => {
    const entry: Record<string, any> = { subject: skill };
    selectedStudents.forEach((s) => {
      entry[s.full_name] = s[skill.toLowerCase() as keyof Student] || 0;
    });

    // Average (benchmark)
    if (students.length > 0) {
      const avg = students.reduce((sum, st) => sum + ((st[skill.toLowerCase() as keyof Student] as number) || 0), 0) / students.length;
      entry["Average"] = Math.round(avg);
    }

    return entry;
  });

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <Link to="/dashboard/coach/students" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to Students
      </Link>

      <header>
        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black text-foreground mb-2">
          Student <span className="text-accent">Comparison</span>
        </h1>
        <p className="text-muted-foreground font-['Poppins']">Select up to 3 students to compare side-by-side.</p>
      </header>

      {/* Student Selection */}
      <div className="bg-card p-6 rounded-[28px] border border-border">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground"><Users size={18} className="text-accent" /> Select Students</h3>
        <div className="flex flex-wrap gap-2 font-['Poppins']">
          {students.map((s) => {
            const isSelected = selected.includes(s.id);
            return (
              <button
                key={s.id} onClick={() => toggleStudent(s.id)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                  isSelected
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s.full_name}
                {isSelected && <X size={14} className="inline ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedStudents.length >= 2 && (
        <>
          {/* Radar Chart */}
          <div className="bg-card p-6 rounded-[28px] border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
              <BarChart3 size={18} className="text-accent" /> Skill Comparison
            </h3>
            <div className="h-[350px] font-['Poppins']">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--theme-border)" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--theme-muted-foreground)", fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  {selectedStudents.map((s, i) => (
                    <Radar key={s.id} name={s.full_name} dataKey={s.full_name}
                      stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                  ))}
                  <Radar name="Average" dataKey="Average" stroke="var(--theme-muted-foreground)" fill="var(--theme-muted-foreground)" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Comparison Table */}
          <div className="bg-card p-6 rounded-[28px] border border-border overflow-x-auto shadow-sm">
            <h3 className="font-bold mb-4 text-foreground font-['Playfair_Display']">Stats Overview</h3>
            <table className="w-full text-sm font-['Poppins']">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Metric</th>
                  {selectedStudents.map((s, i) => (
                    <th key={s.id} className="text-center py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS[i] }}>
                      {s.full_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { label: "Matches Played", key: "matches_played" },
                  { label: "Wins", key: "wins" },
                  { label: "Win Rate", key: "winRate" },
                  { label: "Speed", key: "speed" },
                  { label: "Power", key: "power" },
                  { label: "Technique", key: "technique" },
                  { label: "Stamina", key: "stamina" },
                  { label: "Mental", key: "mental" },
                ].map(({ label, key }) => (
                  <tr key={key}>
                    <td className="py-3 font-bold text-muted-foreground">{label}</td>
                    {selectedStudents.map((s) => (
                      <td key={s.id} className="py-3 text-center font-mono font-bold text-foreground">
                        {key === "winRate"
                          ? `${s.matches_played ? Math.round(((s.wins || 0) / s.matches_played) * 100) : 0}%`
                          : (s as any)[key] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedStudents.length < 2 && (
        <div className="text-center py-16 text-muted-foreground/30">
          <Users size={40} className="mx-auto mb-4" />
          <p className="font-['Poppins']">Select at least 2 students to compare.</p>
        </div>
      )}
    </div>
  );
}
