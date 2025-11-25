import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

// Configure Supabase client for browser and Capacitor (mobile) environments
const supabaseOptions = {
  auth: {
    // For Capacitor apps, use a custom URL scheme for OAuth redirects
    // For web, redirect to /auth/callback to handle email verification
    redirectTo: Capacitor.isNativePlatform()
      ? "unpuff://auth/callback"
      : `${window.location.origin}/auth/callback`,
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session from URL (for OAuth callbacks)
    detectSessionInUrl: !Capacitor.isNativePlatform(),
  },
};

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseOptions
);
