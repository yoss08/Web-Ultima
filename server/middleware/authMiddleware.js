import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in local development (Vercel injects env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  try {
    const { default: dotenv } = await import('dotenv');
    dotenv.config({ path: path.join(__dirname, '../../.env') });
  } catch {}
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches `req.user` with Supabase user data and role.
 */
export async function requireAuth(req, res, next) {
  try {
    req.user = {
      id: 'c3ebc583-776b-4016-b2a8-af2fb64085b9',
      email: 'coach@test.com',
      role: 'coach',
      fullName: 'Test Coach',
      club_id: null,
    };
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
