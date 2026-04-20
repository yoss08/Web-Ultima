import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * GET /api/superadmin/admins
 * Retrieve all users with the 'admin' role and their associated club information.
 */
router.get('/admins', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        email, 
        phone, 
        role, 
        club_id, 
        created_at
      `)
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('[SuperAdmin] Fetch admins error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/superadmin/admins
 * Create a new admin account using Supabase Admin Auth API.
 * This assigns the 'admin' role and links the user to a specific club.
 */
router.post('/admins', async (req, res) => {
  try {
    const { email, password, fullName, phone, clubId } = req.body;

    if (!email || !password || !fullName || !clubId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create user in Supabase Auth via Admin API (bypasses email confirmation if desired)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
      user_metadata: {
        full_name: fullName,
        phone_number: phone || '',
        account_type: 'admin',
      },
    });

    if (authError) throw authError;

    // 2. Create/Update profile with the admin role and club_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        phone: phone || '',
        role: 'admin',
        club_id: clubId
      }, { onConflict: 'id' })
      .select()
      .single();

    if (profileError) throw profileError;

    // 3. Update the club to reference this admin (and optionally super admin)
    // You may want to get the super admin's ID from req.user or session if available
    const superAdminId = req.user?.id || null; // Adjust as needed
    const { error: clubUpdateError } = await supabase
      .from('clubs')
      .update({ admin_id: authData.user.id, super_admin_id: superAdminId })
      .eq('id', clubId);
    if (clubUpdateError) throw clubUpdateError;

    res.status(201).json(profileData);
  } catch (error) {
    console.error('[SuperAdmin] Create admin error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/superadmin/admins/:id
 * Remove an admin user from both Auth and the profiles table.
 */
router.delete('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from Supabase Auth (cascades to profiles if schema is set up, 
    // otherwise we delete from profiles manually)
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Manual profile deletion if no FK cascade is present
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    res.json({ success: true, message: 'Admin account deleted successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Delete admin error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/superadmin/stats
 * Platform-wide statistics for the Super Admin Dashboard.
 */
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('rpc_get_platform_stats');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;