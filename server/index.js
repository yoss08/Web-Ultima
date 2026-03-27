import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

// Flexible CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) 
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
      const isVercelPreview = origin.endsWith('.vercel.app');
      const isAllowedDomain = allowedOrigins.includes(origin);

      if (isLocalhost || isVercelPreview || isAllowedDomain || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});


io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    socket.join(`user_${userId}`);
    console.log(`Client ${socket.id} joined room user_${userId}`);
  }

  socket.on('send-feedback-notification', ({ studentId, coachName }) => {
    // Broadcast to the specific student
    io.to(`user_${studentId}`).emit('receive-feedback-notification', {
      message: `Coach ${coachName || 'your coach'} has left a new evaluation!`,
      coachName
    });
    console.log(`Notification sent to student ${studentId} from coach ${coachName}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from socket.io:', socket.id);
  });
});


app.use(cors());
app.use(express.json());

// Init Supabase Client with Service Role Key (for backend operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Import middleware
import { requireAuth, requireRole } from './middleware/authMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';

// Basic health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ULTIMA API is running' });
});

// Auth Routes (public — no middleware)
app.use('/api/auth', authRoutes);

// Protected Routes — require authentication + role
app.use('/api/admin', requireAuth, requireRole('admin'), adminRoutes);
app.use('/api/coach', requireAuth, requireRole('coach', 'admin'), coachRoutes);
app.use('/api/player', requireAuth, playerRoutes);
app.use('/api/competitions', requireAuth, competitionRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
