import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, LayoutDashboard, Phone, Mail, Zap, Play, Edit2, Eye, Info, XCircle, Trophy, Calendar, Users, Medal, DollarSign } from "lucide-react";
import { useTheme } from "../../styles/useTheme";
import { useAuth } from "../../services/AuthContext";
import { supabase } from "../../config/supabase";

export function LiveMatchesPage() {
  const { isDark, setIsDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const role = user?.user_metadata?.account_type?.toLowerCase() || "guest";
  const [activeTab, setActiveTab] = useState<'matches' | 'competitions'>('matches');

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .in("status", ["Open", "Ongoing"])
          .order("start_date", { ascending: true })
          .limit(4);

        if (error) throw error;
        setTournaments(data || []);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoadingTournaments(false);
      }
    }
    fetchTournaments();
  }, []);

  // Cette liste sera vide jusqu'à ce que l'Admin crée un match en base
  const matches: any[] = []; 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0A0E1A] dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[rgba(10,14,26,0.8)] backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300"
      >
        <div className="max-w-[1096px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-['Arial',sans-serif] font-bold text-[20px] sm:text-[24px] text-gray-900 dark:text-white tracking-[1.2px] transition-colors duration-300"
            >
              ULTIMA
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/#contact" className="text-sm font-medium hover:text-blue-500 transition-colors">Contact</Link>
              <Link to="/solutions" className="text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
              <Link to="/summa" className="text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
              <Link to="/almus" className="text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>

              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
               {user ? (
          // SI CONNECTÉ
          <Link
            to="/dashboard"
            className="bg-[#39FF14] hover:bg-[#32e612] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-[#39FF14]/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          // SI DÉCONNECTÉ
          <>
              <Link
                to="/signup" className="bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </Link>
              </>
              )}
              {/* Nouveau Bouton Live Matches */}
              <Link
                to="/live-matches"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                  Live Matches
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0E1A] overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                <Link to="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Contact</Link>
                <Link to="/solutions" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">Solutions</Link>
                <Link to="/summa" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">SUMMA</Link>
                <Link to="/almus" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-blue-500 transition-colors">ALMUS</Link>

                <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                  <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  {user ? (
          // SI CONNECTÉ
          <Link
            to="/dashboard"
            className="w-full bg-[#39FF14] hover:bg-[#32e612] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-bold text-[14px] text-black flex items-center justify-center gap-2 shadow-lg shadow-[#39FF14]/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          // SI DÉCONNECTÉ
          <>
              <Link
                to="/signup" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-[#00E5FF] dark:hover:bg-[#00D4E6] h-[40px] px-6 rounded-full hover:scale-105 transition-all duration-300 font-['Poppins',sans-serif] font-semibold text-[14px] text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                Get Started
              </Link>
              </>
              )}
                  <Link to="/live-matches" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-red-600 dark:text-red-500">
                      Live Matches
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero / Main Content */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute bg-blue-400/10 dark:bg-[rgba(0,229,255,0.05)] blur-[120px] left-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[10%]" />
          <div className="absolute bg-emerald-400/10 dark:bg-[rgba(57,255,20,0.03)] blur-[120px] right-[10%] rounded-full w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] top-[5%]" />
        </div>

        <div className="max-w-[1096px] mx-auto z-10 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h1 className="text-4xl font-bold dark:text-white font-['Playfair_Display']">Live Action</h1>
              <p className="text-gray-500 mt-2 text-lg">
                Follow live scores and join ongoing competitions.
              </p>
            </div>
            
            {/* Tabs */}
            <div className="mt-6 sm:mt-0 flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('matches')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'matches'
                    ? 'bg-white dark:bg-[#0D121F] text-black dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Live Matches
              </button>
              <button
                onClick={() => setActiveTab('competitions')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'competitions'
                    ? 'bg-white dark:bg-[#0D121F] text-black dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Competitions
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'matches' ? (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {matches.length === 0 ? (
                  <div className="bg-white dark:bg-[#0D121F] rounded-[32px] p-20 border-2 border-dashed border-gray-200 dark:border-white/10 text-center shadow-sm">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white">No matches currently</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Live scores will appear here once the games begin.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {/* Exemple de Carte de Match avec Boutons Dynamiques */}
                    <div className="bg-white dark:bg-[#0D121F] p-6 rounded-[28px] border border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-full mb-2 mx-auto" />
                          <p className="font-bold dark:text-white text-sm">Player 1</p>
                        </div>
                        <div className="text-2xl font-black text-red-500">VS</div>
                        <div className="text-center">
                          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-full mb-2 mx-auto" />
                          <p className="font-bold dark:text-white text-sm">Player 2</p>
                        </div>
                      </div>

                      {/* --- BOUTONS PAR RÔLE --- */}
                      <div className="flex gap-3">
                        {role === 'admin' && (
                          <>
                            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-xl text-sm">
                              <Edit2 size={16} /> Edit Score
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl text-sm">
                              <XCircle size={16} /> Stop
                            </button>
                          </>
                        )}

                        {role === 'coach' && (
                          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all">
                            <Play size={16} /> Analysis Mode
                          </button>
                        )}

                        {role === 'player' && (
                          <button className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 font-bold rounded-xl text-sm">
                            <Eye size={16} /> Watch Live
                          </button>
                        )}
                        
                        {role === 'guest' && (
                          <button className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-all">
                            <Eye size={16} /> Watch
                          </button>
                        )}
                        
                        <button className="p-2 dark:text-white/40"><Info size={20}/></button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="competitions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold dark:text-white">Ongoing Competitions</h2>
                  <Link to={user ? "/dashboard/competitions" : "/signup"} className="px-6 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-semibold text-sm dark:text-white">
                    View All
                  </Link>
                </div>

                {loadingTournaments ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="bg-white dark:bg-[#0D121F] rounded-[32px] p-20 border-2 border-dashed border-gray-200 dark:border-white/10 text-center shadow-sm">
                    <Trophy className="mx-auto mb-4 text-gray-400" size={32} />
                    <h3 className="text-xl font-bold dark:text-white">No competitions available</h3>
                    <p className="text-gray-500 mt-2">Check back later for new tournaments.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tournaments.map((t) => (
                      <div key={t.id} className="bg-white dark:bg-[#0D121F] p-6 rounded-[28px] border border-gray-100 dark:border-white/10 flex flex-col gap-6 shadow-sm hover:border-[#39FF14]/40 transition-all duration-300 group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#39FF14]/20">
                              <Trophy className="text-[#39FF14]" size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                   t.status === 'Open' ? 'bg-[#39FF14]/10 text-[#39FF14]' :
                                   t.status === 'Ongoing' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' :
                                   'bg-gray-100 dark:bg-white/5 text-gray-400'
                                 }`}>
                                   {t.status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest leading-none">
                                   {t.competition_type}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold dark:text-white group-hover:text-[#39FF14] transition-colors">
                                {t.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
                              <Calendar size={12} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Date</span>
                            </div>
                            <p className="text-sm font-bold dark:text-white uppercase">{new Date(t.start_date).toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
                              <Users size={12} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Participants</span>
                            </div>
                            <p className="text-sm font-bold dark:text-white uppercase">{t.current_players}/{t.max_players}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
                              <Medal size={12} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Reward</span>
                            </div>
                            <p className="text-sm font-bold dark:text-white uppercase">{t.prize_pool || "N/A"}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
                              <DollarSign size={12} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Fee</span>
                            </div>
                            <p className="text-sm font-bold dark:text-white uppercase">{t.entry_fee === 0 ? "Free" : `$${t.entry_fee}`}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-white/10 mt-auto">
                          <Link
                            to={user ? "/dashboard/competitions" : "/signup"}
                            className="w-full h-12 flex items-center justify-center bg-[#39FF14] text-black font-bold rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-[#39FF14]/20"
                          >
                            {user ? "View & Register" : "Sign Up to Register"}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-700 dark:border-white/10 py-12 transition-colors duration-300 relative z-10">
        <div className="max-w-[1096px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo Column */}
            <div>
              <h3 className="font-['Arial',sans-serif] font-bold text-[20px] text-white mb-4">
                ULTIMA
              </h3>
            </div>

            {/* ULTIMA Column */}
            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                ULTIMA
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    About us
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                Support
              </h4>
              <ul className="space-y-2">

                <li>
                  <button
                    className="font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-2">
                <ul className="space-y-4">

                  <li>
                    <a
                      href="tel:+21696094772"
                      className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span>96 094 772</span>
                    </a>
                  </li>


                  <li>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=Ultima.contacus@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <Mail className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Ultima.contacus@gmail.com</span>
                    </a>
                  </li>
                </ul>
              </ul>
            </div>
          </div>


          {/* Copyright */}
          <div className="pt-8 border-t border-gray-700 dark:border-white/10 text-center">
            <p className="font-['Poppins',sans-serif] text-[14px] text-gray-400">
              © {new Date().getFullYear()} ULTIMA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}