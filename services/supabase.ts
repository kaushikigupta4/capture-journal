
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxzabyodzwxpqiwzwefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4emFieW9kend4cHFpd3p3ZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjQ0OTAsImV4cCI6MjA4NTU0MDQ5MH0.WymBV5seNAECKAprUDpMor0NMV7kU49PG6gFY-68llU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
