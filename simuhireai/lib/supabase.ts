// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://evovvvcrdgtfkaocvvms.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b3Z2dmNyZGd0Zmthb2N2dm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzAyMDAsImV4cCI6MjA2MjkwNjIwMH0.w-B7MzV6A-dzlTztGC7znnsttEmEdJAQQAUpkGSsA1E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
