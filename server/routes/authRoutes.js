import express from 'express';
import { supabase } from '../index.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Create a new user account with email/password and role.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const allowedRoles = ['player', 'coach'];
    const userRole = allowedRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'player';

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Requires email verification
      user_metadata: {
        full_name: fullName,
        phone_number: phone || '',
        account_type: userRole,
      },
    });

    if (authError) throw authError;

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone: phone || '',
        role: userRole,
        email: email,
      });

    if (profileError) {
      console.error('[Auth] Profile creation error:', profileError.message);
      // User was created in auth but profile failed — not critical, can be retried
    }

    res.status(201).json({
      message: 'Account created. Please verify your email.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error('[Auth] Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user, return JWT token + user role.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name || data.user.user_metadata?.full_name,
        role: profile?.role || data.user.user_metadata?.account_type || 'player',
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh an expired JWT token.
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw error;

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    });
  } catch (error) {
    console.error('[Auth] Refresh error:', error.message);
    res.status(401).json({ error: error.message });
  }
});

/**
 * POST /api/auth/logout
 * Invalidate the current session.
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Sign out from Supabase to invalidate the session
      await supabase.auth.admin.signOut(authHeader.split(' ')[1]);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // Even if signOut fails, we consider the logout successful client-side
    res.json({ message: 'Logged out' });
  }
});

export default router;
