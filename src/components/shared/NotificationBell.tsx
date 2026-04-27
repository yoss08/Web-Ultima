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
      const data = await notificationService.getMyNotifications();
      if (!mountedRef.current) return;
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
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-[28px] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground font-['Playfair_Display'] text-lg">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-border/50 flex gap-3 transition-colors ${n.read ? 'opacity-60' : 'bg-accent/5'}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${n.read ? 'bg-muted-foreground/30' : 'bg-accent'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium mb-1 font-['Poppins']">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!n.read && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Bell size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                    <p className="text-muted-foreground text-sm font-['Poppins']">No notifications yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-muted/30 text-center">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/dashboard/settings?tab=notifications');
                  }}
                  className="text-[10px] font-black uppercase tracking-[2px] text-accent hover:opacity-80"
                >
                  View All Activity
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}