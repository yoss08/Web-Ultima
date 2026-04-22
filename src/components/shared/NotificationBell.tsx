import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../../services/NotificationService';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../config/supabase';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
      const unread = data.filter((n: any) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Real-time subscription
    if (user) {
      const channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

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
                <button className="text-[10px] font-black uppercase tracking-[2px] text-accent hover:opacity-80">
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
