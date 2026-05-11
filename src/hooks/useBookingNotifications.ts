import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../services/AuthContext';

/**
 * Hook that listens for new bookings on the platform and creates
 * a notification for the currently logged-in super admin user.
 *
 * Only active when the authenticated user has the role `super_admin`.
 * Uses Supabase Realtime `postgres_changes` on the `bookings` table.
 */
export function useBookingNotifications() {
  const { user } = useAuth();
  const mountedRef = useRef(true);

  const role = (
    user?.role ??
    user?.user_metadata?.account_type ??
    user?.user_metadata?.accountType ??
    ''
  ).toLowerCase();

  useEffect(() => {
    if (role !== 'super_admin' || !user?.id) return;

    mountedRef.current = true;

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let subscribed = false;

    channel = supabase
      .channel('superadmin-new-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        async (payload) => {
          if (!mountedRef.current || !user?.id) return;

          const booking = payload.new as Record<string, any>;

          // Fetch player name and court name to build a useful message
          let playerName = 'A player';
          let courtName = 'a court';

          try {
            const [profileResult, courtResult] = await Promise.all([
              booking.user_id
                ? supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', booking.user_id)
                    .single()
                : Promise.resolve({ data: null }),
              booking.court_id
                ? supabase
                    .from('courts')
                    .select('name')
                    .eq('id', booking.court_id)
                    .single()
                : Promise.resolve({ data: null }),
            ]);

            if (profileResult.data?.full_name) {
              playerName = profileResult.data.full_name;
            }
            if (courtResult.data?.name) {
              courtName = courtResult.data.name;
            }
          } catch {
            // Non-critical — proceed with generic message
          }

          const date = booking.booking_date
            ? new Date(booking.booking_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'an upcoming date';

          const message = `📅 New reservation: ${playerName} booked ${courtName} on ${date}.`;

          if (!mountedRef.current) return;

          try {
            await supabase.from('notifications').insert([
              {
                user_id: user.id,
                type: 'new_booking',
                message,
                read: false,
              },
            ]);
          } catch {
            // Fail silently — notification is best-effort
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') subscribed = true;
      });

    return () => {
      mountedRef.current = false;
      if (channel) {
        if (subscribed) {
          supabase.removeChannel(channel);
        } else {
          channel.unsubscribe().then(() => supabase.removeChannel(channel!));
        }
      }
    };
  }, [user?.id, role]);
}
