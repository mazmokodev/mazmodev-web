// lib/supabaseClient.ts (Kode baru, menggunakan import.meta.env)
import { createClient } from "@supabase/supabase-js";

// Ganti process.env dengan import.meta.env di proyek Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Anda bisa menambahkan pengecekan (opsional)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
