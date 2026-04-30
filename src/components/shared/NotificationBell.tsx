import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { notificationService } from '../../services/NotificationService';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../config/supabase';

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchNotifications = async () => {
    if (!user || !mountedRef.current) return;
    try {
      let data = await notificationService.getMyNotifications();
      if (!mountedRef.current) return;

      // Filter out booking-related notifications for coaches
      if (user.role === 'coach') {
        data = (data ?? []).filter((n: any) => 
          !n.type?.toLowerCase().includes('booking') && 
          !n.message?.toLowerCase().includes('booking')
        );
      }

      setNotifications(data ?? []);
      setUnreadCount((data ?? []).filter((n: any) => !n.read).length);
    } catch (error: any) {
      // 500 = table missing or RLS blocks access — fail silently, don't crash the bell
      if (mountedRef.current) {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Track subscription status to avoid removing a channel
    // that was never fully established (causes the WS "closed before connected" error)
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let subscribed = false;

    channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          if (mountedRef.current) fetchNotifications();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') subscribed = true;
      });

    return () => {
      // Only remove the channel if it finished subscribing;
      // otherwise Supabase would throw "WebSocket closed before connection"
      if (channel) {
        if (subscribed) {
          supabase.removeChannel(channel);
        } else {
          // Channel is still connecting — unsubscribe gracefully then remove
          channel.unsubscribe().then(() => supabase.removeChannel(channel!));
        }
      }
    };
  }, [user?.id]); // depend on id only, not the whole user object

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleRespond = async (id: string, action: 'confirm' | 'decline') => {
    try {
      await notificationService.respondToNotification(id, action);
      fetchNotifications();
    } catch (error) {
      console.error("Error responding to notification:", error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-all relative"
      >
        <Bell size={20} className={unreadCount > 0 ? "text-accent animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed sm:absolute top-20 sm:top-auto right-4 left-4 sm:right-0 sm:left-auto sm:mt-3 sm:w-96 bg-card border border-border rounded-[28px] shadow-2xl z-50 overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground font-['Playfair_Display'] text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-black rounded-full uppercase tracking-widest">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '400px' }}>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-border/50 flex gap-4 transition-colors relative group ${n.read ? 'opacity-60' : 'bg-accent/5'}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${n.read ? 'bg-muted-foreground/30' : 'bg-accent shadow-[0_0_10px_rgba(204,255,0,0.5)]'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium mb-1 font-['Poppins'] leading-snug">{n.message}</p>
                        
                        {/* Interactive Actions for Coach Assignments */}
                        {n.type === 'student_assignment' && !n.read && (
                          <div className="flex gap-2 mt-3 mb-1">
                            <button 
                              onClick={() => handleRespond(n.id, 'confirm')}
                              className="flex-1 h-8 bg-accent text-accent-foreground rounded-lg text-[10px] font-black uppercase tracking-wider hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                            >
                              <Check size={12} strokeWidth={3} /> Confirm
                            </button>
                            <button 
                              onClick={() => handleRespond(n.id, 'decline')}
                              className="flex-1 h-8 bg-muted text-foreground rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-1.5"
                            >
                              <X size={12} strokeWidth={3} /> Decline
                            </button>
                          </div>
                        )}

                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && n.type !== 'student_assignment' && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-accent/10 text-accent opacity-0 group-hover:opacity-100 sm:opacity-100 transition-all"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell size={32} className="text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground text-sm font-['Poppins']">All caught up!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-muted/20 border-t border-border/50 text-center">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/dashboard/settings?tab=notifications');
                  }}
                  className="w-full py-2.5 rounded-xl bg-card border border-border text-[10px] font-black uppercase tracking-[2px] text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  View Full History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}