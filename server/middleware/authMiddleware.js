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
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('[AuthMiddleware] Invalid token:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get the user's profile to get the role and club_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, club_id, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[AuthMiddleware] Profile fetch error:', profileError.message);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
      fullName: profile.full_name,
      club_id: profile.club_id,
    };
    
    next();
  } catch (err) {
    console.error('[AuthMiddleware] Error:', err.message);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

/**
 * Middleware factory: Require specific role(s) to access a route.
 * @param {...string} roles - The roles allowed to access the route.
 * @returns {import('express').RequestHandler} An Express middleware function.
 * @example app.use('/admin', requireAuth, requireRole('admin'))
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
