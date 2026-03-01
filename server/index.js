import express from 'express';
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

app.use(cors());
app.use(express.json());

// Init Supabase Client with Service Key (for backend operations)
// If you don't have the service key yet, this acts as a placeholder
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Ideally use SERVICE_ROLE_KEY here
export const supabase = createClient(supabaseUrl, supabaseKey);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ULTIMA API is running' });
});

import adminRoutes from './routes/adminRoutes.js';

// Admin Routes
app.use('/api/admin', adminRoutes);

// Other placeholders for completeness until created
app.use('/api/admin/bookings', (req, res) => res.json([]));
app.use('/api/admin/players', (req, res) => res.json([]));
app.use('/api/admin/competitions', (req, res) => res.json([]));

import coachRoutes from './routes/coachRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';

// Coach Routes
app.use('/api/coach', coachRoutes);

// Player Routes
app.use('/api/player', playerRoutes);

// Competition Routes
app.use('/api/competitions', competitionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
