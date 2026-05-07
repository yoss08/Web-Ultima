import { supabase } from '../config/supabase';
import { PLAYER_API } from '../config/apiConfig';

/**
 * Service for handling notifications using Supabase and backend API.
 */
export const notificationService = {
  /**
   * Retrieves all notifications for the current authenticated user.
   * @returns {Promise<Array>} List of notifications.
   */
  async getMyNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Marks a specific notification as read.
   * @param {string} notificationId - The ID of the notification to mark.
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Creates a new notification for a user.
   * @param {string} userId - ID of the recipient user.
   * @param {string} type - The type/category of the notification.
   * @param {string} message - The notification message.
   * @returns {Promise<Object>} The created notification object.
   */
  async createNotification(userId: string, type: string, message: string) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        type,
        message,
        read: false
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Gets the count of unread notifications for the current user.
   * @returns {Promise<number>} Number of unread notifications.
   */
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },
  
  /**
   * Responds to an interactive notification (e.g., confirm/decline invitation).
   * @param {string} notificationId - ID of the notification.
   * @param {'confirm' | 'decline'} action - The user's action.
   * @returns {Promise<Object>} The API response.
   */
  async respondToNotification(notificationId: string, action: 'confirm' | 'decline') {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${PLAYER_API}/notifications/${notificationId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ action })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to respond to notification');
    }
    
    return response.json();
  }
};
