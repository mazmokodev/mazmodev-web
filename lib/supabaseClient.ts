
import { createClient } from '@supabase/supabase-js';

// GANTI DENGAN KREDENSIAL SUPABASE ANDA DARI DASHBOARD
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
