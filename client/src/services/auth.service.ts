import { supabase } from "@/lib/supabase";
import { Capacitor } from "@capacitor/core";
import { AuthError, NetworkError } from "./errors";
import type { User } from "@shared/schema";

// Get the appropriate redirect URL based on platform
function getAuthCallbackUrl(): string {
  return Capacitor.isNativePlatform()
    ? "unpuff://auth/callback"
    : `${window.location.origin}/auth/callback`;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username?: string; // Optional username
}

export interface GoogleSignInRequest {
  redirectTo?: string;
}

/**
 * Maps Supabase Auth user to our User type
 */
function mapSupabaseUserToUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id || "",
    supabase_user_id: supabaseUser.id || "",
    email: supabaseUser.email || "",
    username:
      supabaseUser.user_metadata?.username ||
      supabaseUser.email?.split("@")[0] ||
      null,
    created_at: supabaseUser.created_at
      ? new Date(supabaseUser.created_at)
      : new Date(),
  };
}

export class AuthService {
  /**
   * Sign up with email and password
   */
  async signup(credentials: SignupRequest): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
          data: {
            username: credentials.username || credentials.email.split("@")[0],
          },
        },
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          throw new AuthError("Email already registered", 400);
        }
        throw new AuthError(error.message || "Failed to sign up", 400);
      }

      if (!data.user) {
        throw new AuthError("Failed to create user", 500);
      }

      // Create user profile in our database
      // Note: This will be handled by a database trigger or server-side function
      // For now, we'll return the mapped user
      return mapSupabaseUserToUser(data.user);
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new NetworkError(`Failed to sign up: ${error.message}`, error);
      }
      throw new NetworkError("Failed to sign up", error);
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new AuthError(
            "Please confirm your email address before signing in",
            401
          );
        }
        if (error.message.includes("Invalid login credentials")) {
          throw new AuthError("Invalid email or password", 401);
        }
        throw new AuthError(error.message || "Failed to login", 401);
      }

      if (!data.user) {
        throw new AuthError("Failed to authenticate", 401);
      }

      return mapSupabaseUserToUser(data.user);
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new NetworkError(`Failed to login: ${error.message}`, error);
      }
      throw new NetworkError("Failed to login", error);
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(options?: GoogleSignInRequest): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: options?.redirectTo || getAuthCallbackUrl(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw new AuthError(
          error.message || "Failed to sign in with Google",
          500
        );
      }
      // OAuth redirect will happen, so we don't return a user here
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new NetworkError(
          `Failed to sign in with Google: ${error.message}`,
          error
        );
      }
      throw new NetworkError("Failed to sign in with Google", error);
    }
  }

  /**
   * Get current session/user
   */
  async getSession(): Promise<User | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

      if (!session?.user) {
        return null;
      }

      return mapSupabaseUserToUser(session.user);
    } catch (error: any) {
      console.error("Failed to get session:", error);
      return null;
    }
  }

  /**
   * Get current user (synchronous check)
   */
  async getUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return mapSupabaseUserToUser(user);
    } catch (error: any) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new NetworkError(`Failed to logout: ${error.message}`, error);
      }
    } catch (error: any) {
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError("Failed to logout", error);
    }
  }

  /**
   * Check if user is authenticated (synchronous check)
   * Note: This is a best-effort check. Use getSession() for accurate authentication status.
   */
  isAuthenticated(): boolean {
    // Check if Supabase session exists in localStorage
    // Supabase stores session as: sb-{project-ref}-auth-token
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) return false;

      // Extract project ref from URL (e.g., https://xyz.supabase.co -> xyz)
      const projectRef = supabaseUrl.match(
        /https?:\/\/([^.]+)\.supabase\.co/
      )?.[1];
      if (!projectRef) return false;

      const sessionKey = `sb-${projectRef}-auth-token`;
      return !!localStorage.getItem(sessionKey);
    } catch {
      return false;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = mapSupabaseUserToUser(session.user);
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
