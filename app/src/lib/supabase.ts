import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vfpubpsebenooycgekom.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcHVicHNlYmVub295Y2dla29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDc0NDgsImV4cCI6MjA3MzQ4MzQ0OH0.coxYKR5hQLayUOxcHI5HZJIyhYF62Knq31v9uEfunhE";

// service role key (DO NOT USE IN PRODUCTION)
const supabaseServiceRokeKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcHVicHNlYmVub295Y2dla29tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzkwNzQ0OCwiZXhwIjoyMDczNDgzNDQ4fQ.E86i_4R8YiUhbyrDsln5jnfrauLzntv3S2Mg6Riv2BM";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRokeKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
