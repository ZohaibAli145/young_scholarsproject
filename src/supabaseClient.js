import { createClient } from '@supabase/supabase-js';

// Create a free project at https://supabase.com, then paste your project
// URL and anon key into a .env file at the project root (see .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
