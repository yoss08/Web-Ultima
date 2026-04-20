import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches `req.user` with Supabase user data and role.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch role and club_id from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, club_id')
      .eq('id', user.id)
      .single();

    console.log('[AuthMiddleware] User ID:', user.id);
    console.log('[AuthMiddleware] Profile:', profile);

    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || user.user_metadata?.account_type || 'player',
      fullName: profile?.full_name || user.user_metadata?.full_name || '',
      club_id: profile?.club_id || null,
    };
    console.log('[AuthMiddleware] req.user:', req.user);

    next();
  } catch (err) {
    console.error('[AuthMiddleware] Error:', err.message);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

/**
 * Middleware: Require specific role(s).
 * Usage: requireRole('admin') or requireRole('admin', 'coach')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userRole = req.user.role?.toLowerCase();
    const allowed = roles.map(r => r.toLowerCase());

    console.log('[RequireRole] User role:', userRole, 'Allowed:', allowed);

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden: insufficient permissions',
        required: roles,
        current: userRole 
      });
    }

    next();
  };
}
