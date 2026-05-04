import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../config/supabase';
import { 
  Calendar, Users, Trophy, Zap, Loader2,
  MapPin, ArrowLeft, PersonStanding, Phone, ShieldCheck, CheckCircle2,
  Medal, Ticket, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { notificationService } from '../../services/NotificationService';
import { MOCK_TOURNAMENTS } from '../../utils/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tournament {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  max_players: number;
  current_players: number;
  prize_pool: string | null;
  competition_type: string | null;
  registration_deadline: string | null;
  entry_fee: number;
  rules_text: string | null;
  created_by: string;
  club_id: string | null;
  created_at: string;
  clubs?: { name?: string; location?: string };
  userRegistration?: {
    id: string;
    status: string;         // 'en attente' | 'accepté' | 'refusé'
  } | null;
}

type Filter = 'available' | 'joined' | 'all';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Component ────────────────────────────────────────────────────────────────

const PlayerTournamentsPage: React.FC = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<Filter>('available');
  const [loading, setLoading] = useState(true);
  
  // Registration Modal State
  const [registeringTournament, setRegisteringTournament] = useState<Tournament | null>(null);

  // Form States
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchTournaments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: allTournaments, error: tErr } = await supabase
        .from('tournaments')
        .select('*, clubs(name, location)')
        .order('start_date', { ascending: true });

      if (tErr) throw tErr;

      const { data: myRegs, error: rErr } = await supabase
        .from('tournament_registrations')
        .select('id, tournament_id, status')
        .eq('player_id', user.id);

      if (rErr) throw rErr;

      const regMap = new Map(myRegs?.map((r: any) => [r.tournament_id, { id: r.id, status: r.status }]) ?? []);

      const USE_MOCK_DATA = true; // Set to false to use only real DB data
      
      let enriched = await Promise.all(
        (allTournaments ?? []).map(async (t: any) => {
          const { count } = await supabase
            .from('tournament_registrations')
            .select('id', { count: 'exact', head: true })
            .eq('tournament_id', t.id)
            .eq('status', 'accepté');

          return {
            ...t,
            current_players: count ?? 0,
            userRegistration: regMap.get(t.id) ?? null,
          } as Tournament;
        })
      );

      if (USE_MOCK_DATA) {
        // We cast MOCK_TOURNAMENTS to any then back to Tournament if needed, 
        // but we already have the type defined.
        enriched = [...enriched, ...(MOCK_TOURNAMENTS as any[])];
      }

      setTournaments(enriched);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (registeringTournament) {
      const loadProfile = async () => {
        if (!user?.id) return;
        const { data } = await supabase.from('profiles').select('full_name, phone').eq('id', user.id).single();
        if (data) {
          if (data.full_name) setFullName(data.full_name);
          if (data.phone) setPhone(data.phone);
        }
      };
      loadProfile();
    }
  }, [registeringTournament, user?.id]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const submitRegistration = async () => {
    if (!user?.id || !registeringTournament) return;
    if (!fullName || !phone) return toast.error('Please fill in all fields');
    if (!agreed) return toast.error('Please agree to the terms');

    setIsSubmitting(true);
    try {
      if ((registeringTournament as any).isMock) {
        await new Promise(r => setTimeout(r, 1000));
        setShowSuccess(true);
        toast.success('Registration submitted (Mock)!');
        setIsSubmitting(false);
        return;
      }
      const { error } = await supabase.from('tournament_registrations').insert({
        player_id: user.id,
        tournament_id: registeringTournament.id,
        status: 'en attente',
        registered_at: new Date().toISOString(),
      });
      if (error) throw error;
      
      // Notify admins and super admins
      try {
        const { data: superAdmins } = await supabase.from('profiles').select('id').eq('role', 'super_admin');
        const { data: clubAdmins } = registeringTournament.club_id 
            ? await supabase.from('profiles').select('id').eq('role', 'admin').eq('club_id', registeringTournament.club_id)
            : { data: [] };

        const adminIds = [
            ...(superAdmins || []).map(a => a.id),
            ...(clubAdmins || []).map(a => a.id)
        ];

        const uniqueAdminIds = Array.from(new Set(adminIds));
        const message = `New registration request from ${fullName} for tournament "${registeringTournament.title}"`;

        for (const adminId of uniqueAdminIds) {
            await notificationService.createNotification(
                adminId,
                'tournament_registration',
                message
            );
        }
      } catch (notifyErr) {
        console.error('Failed to send notifications', notifyErr);
      }

      setShowSuccess(true);
      toast.success('Registration submitted! Awaiting approval.');
      await fetchTournaments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOpen = (t: Tournament) => {
  const now = new Date();
  const deadline = t.registration_deadline ? new Date(t.registration_deadline) : null;

  // If the deadline is 07/04/2026, ensure it's compared correctly
  const isBeforeDeadline = !deadline || deadline > now;

  return (
    !t.userRegistration &&
    t.current_players < t.max_players &&
    isBeforeDeadline
  );
};

  const filtered =
    filter === 'joined'
      ? tournaments.filter((t) => t.userRegistration)
      : filter === 'available'
      ? tournaments.filter((t) => isOpen(t))
      : tournaments;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Poppins'] pb-24">
      {/* Header */}
      <div>
          <div className="flex items-center gap-3 text-accent font-bold text-xs uppercase tracking-[3px] mb-2">
            <TrendingUp size={16} />
            <span>Tournament Center</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] sm:text-2xl text-2xl md:text-4xl lg:text-4xl font-black text-foreground leading-none mb-4">Active Competitions</h1>
          <p className="text-muted-foreground font-['Poppins']">
            Register for upcoming tournaments and prove your skills.
          </p>
        </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['available', 'joined', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-[13px] font-bold capitalize transition-all ${
              filter === f
                ? 'bg-accent text-black shadow-[0_0_15px_rgba(202,246,133,0.3)]'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border'
            }`}
          >
            {f === 'available' ? 'Available' : f === 'joined' ? 'My Tournaments' : 'All'}
          </button>
        ))}
      </div>

      {/* Grid of Event Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[400px] bg-card border border-border rounded-[28px] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 bg-card border-2 border-dashed border-border rounded-[32px] text-center">
          <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">No tournaments found</h3>
          <p className="text-muted-foreground text-sm mt-2">Check back later for new competitions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t) => (
            <div 
              key={t.id} 
              className="bg-background border-[1.5px] border-accent/25 rounded-[28px] overflow-hidden shadow-[0_0_40px_rgba(202,246,133,0.05)] hover:shadow-[0_0_40px_rgba(202,246,133,0.15)] hover:border-accent/50 transition-all duration-300 flex flex-col group"
            >
              {/* Image Header */}
              <div className="relative h-[200px] w-full bg-muted overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 flex flex-col items-center justify-center">
                  <Trophy size={60} className="text-accent/30" />
                </div>
                <img 
                  src="/images/popup.png" 
                  alt="Tournament" 
                  className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
                
                {/* Competition Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-accent to-accent/80 px-3 py-1.5 rounded-full shadow-[0_0_8px_rgba(202,246,133,0.4)] flex items-center gap-1.5 z-10">
                  <Trophy size={13} className="text-black" />
                  <span className="text-[10px] font-bold tracking-[1.2px] text-black">COMPETITION</span>
                </div>

                {/* Title & Location */}
                <div className="absolute bottom-4 left-5 right-5 z-10">
                  <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display'] leading-tight mb-1">
                    {t.title}
                  </h2>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-accent" />
                      {formatDate(t.start_date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-accent" />
                      {t.clubs?.name ?? "Unknown Location"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 bg-background relative z-10">
                {/* Spots Row */}
                <div className="flex items-center bg-accent/5 border border-accent/15 rounded-[14px] p-4 mb-5">
                  <Users size={20} className="text-accent" />
                  <div className="ml-3">
                    <p className="text-[13px] font-semibold text-foreground">Spots Available</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t.current_players} / {t.max_players} spots filled
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[16px] font-bold text-accent leading-none">
                      {Math.round((t.current_players / Math.max(t.max_players, 1)) * 100)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 leading-none mt-1">full</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-muted-foreground leading-[1.6] mb-6 line-clamp-3 flex-1">
                  {t.description || "No description provided."}
                </p>

                <div className="mt-auto">
                  {/* Prize & Entry */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-[10px]">
                      <Medal size={14} className="text-accent" />
                      <span className="text-[11px] font-medium text-muted-foreground">Prize: {t.prize_pool || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-[10px]">
                      <Ticket size={14} className="text-accent" />
                      <span className="text-[11px] font-medium text-muted-foreground">Entry: {t.entry_fee || 0} DT</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-3">
                    {t.userRegistration ? (
                      <button 
                        className="flex-1 h-14 rounded-[14px] bg-muted/30 border border-border text-muted-foreground text-[14px] font-medium cursor-default"
                      >
                        {t.userRegistration.status === 'en attente' ? 'Registration Pending' : 'Registered'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setRegisteringTournament(t)}
                        disabled={!isOpen(t)}
                        className={`flex-1 h-14 rounded-[14px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                          isOpen(t) 
                            ? "bg-gradient-to-r from-accent to-accent/80 text-black shadow-[0_4px_14px_rgba(202,246,133,0.3)] hover:opacity-90 hover:shadow-[0_6px_20px_rgba(202,246,133,0.4)]"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {isOpen(t) ? (
                          <>
                            <Zap size={18} className="text-black fill-black" />
                            Get Your Place
                          </>
                        ) : (
                          t.current_players >= t.max_players ? 'Tournament Full' : 'Registration Closed'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Registration Modal (Matches Flutter TournamentRegistrationScreen) */}
      {(registeringTournament || showSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          
          {!showSuccess && registeringTournament && (
            <div className="bg-background w-full max-w-lg h-full max-h-[90vh] rounded-[32px] border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              {/* App Bar equivalent */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 shrink-0">
                <button 
                  onClick={() => { setRegisteringTournament(null); setAgreed(false); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/30 hover:bg-muted text-foreground transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-[17px] font-bold text-foreground">
                  Tournament Entry
                </h2>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {/* Header Card */}
                <div className="p-5 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-[20px] flex items-center mb-10">
                  <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy size={26} className="text-accent" />
                  </div>
                  <div className="ml-5">
                    <h3 className="font-bold text-foreground text-[17px] font-['Playfair_Display']">{registeringTournament.title}</h3>
                    <p className="text-[13px] text-muted-foreground mt-1">Confirm your participation</p>
                  </div>
                </div>
                
                <h4 className="font-bold text-foreground text-[15px] mb-5">Player Information</h4>
                
                {/* Text Fields */}
                <div className="space-y-4 mb-8">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <PersonStanding size={20} className="text-accent group-focus-within:scale-110 transition-transform" />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-card border border-transparent rounded-[16px] py-4 pl-12 pr-4 text-[14px] text-foreground focus:border-accent focus:bg-background transition-all outline-none"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={20} className="text-accent group-focus-within:scale-110 transition-transform" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-card border border-transparent rounded-[16px] py-4 pl-12 pr-4 text-[14px] text-foreground focus:border-accent focus:bg-background transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-4 cursor-pointer mb-10 group bg-card p-4 rounded-[16px] border border-border hover:border-accent/30 transition-colors">
                  <div className="relative flex items-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-[8px] border-[1.5px] border-muted-foreground/40 checked:border-accent checked:bg-accent transition-all"
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-black">
                      <ShieldCheck size={14} />
                    </div>
                  </div>
                  <span className="text-[13px] text-muted-foreground leading-relaxed select-none group-hover:text-foreground transition-colors">
                    I agree to the tournament rules and safety guidelines.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  onClick={submitRegistration}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-accent to-accent/90 text-black rounded-[16px] font-bold text-[16px] shadow-[0_6px_20px_rgba(202,246,133,0.25)] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all mb-4"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
                  {isSubmitting ? 'Processing...' : 'Complete Registration'}
                </button>
                <p className="text-center text-[12px] text-muted-foreground">
                  No payment required at this stage
                </p>
              </div>
            </div>
          )}

          {/* Success Dialog */}
          {showSuccess && (
            <div className="bg-background border border-border rounded-[32px] p-10 w-full max-w-[360px] flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-3">Registration Sent!</h2>
              <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">
                Your request for <strong className="text-foreground">"{registeringTournament?.title}"</strong> is now "en attente". We will notify you once validated.
              </p>
              <button
                onClick={() => { setShowSuccess(false); setRegisteringTournament(null); setAgreed(false); }}
                className="w-full h-12 bg-accent text-black font-bold rounded-full hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(202,246,133,0.2)]"
              >
                Great!
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerTournamentsPage;