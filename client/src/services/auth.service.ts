import { apiRequest } from "@/lib/queryClient";
import { AuthError, NetworkError } from "./errors";
import type { User } from "@shared/schema";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

const AUTH_STORAGE_KEY = "unpuff-auth";

interface AuthStorageData {
  userId: string;
  username: string;
}

export class AuthService {
  private readonly baseURL = "/api/auth";

  /**
   * Login with username and password
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiRequest("POST", `${this.baseURL}/login`, credentials);
      const user = await response.json();

      // Store auth data in localStorage
      const authData: AuthStorageData = {
        userId: user.id,
        username: user.username,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      return user;
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("401")) {
        throw new AuthError("Invalid username or password", 401);
      }
      if (error instanceof Error) {
        throw new NetworkError(`Failed to login: ${error.message}`, error);
      }
      throw new NetworkError("Failed to login", error);
    }
  }

  /**
   * Sign up a new user
   */
  async signup(credentials: SignupRequest): Promise<User> {
    try {
      const response = await apiRequest("POST", `${this.baseURL}/signup`, credentials);
      const user = await response.json();

      // Store auth data in localStorage
      const authData: AuthStorageData = {
        userId: user.id,
        username: user.username,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      return user;
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("400")) {
        throw new AuthError("Username already exists or invalid input", 400);
      }
      if (error instanceof Error) {
        throw new NetworkError(`Failed to sign up: ${error.message}`, error);
      }
      throw new NetworkError("Failed to sign up", error);
    }
  }

  /**
   * Get current session/user
   * Note: Currently requires userId from localStorage until server-side sessions are implemented
   */
  async getSession(): Promise<User | null> {
    try {
      // Get userId from localStorage (temporary until cookie-based sessions)
      const authDataStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authDataStr) {
        return null;
      }

      const authData: AuthStorageData = JSON.parse(authDataStr);
      if (!authData.userId) {
        return null;
      }

      const response = await fetch(
        `${this.baseURL}/session?userId=${encodeURIComponent(authData.userId)}`,
        {
          credentials: "include",
        },
      );

      if (response.status === 401 || response.status === 404) {
        // Session invalid, clear localStorage
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      // If network error, return null (user not authenticated)
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        return null;
      }
      // For other errors, clear auth and return null
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }

  /**
   * Logout current user
   * Clears localStorage and invalidates session
   */
  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // TODO: Call logout endpoint when available
  }

  /**
   * Check if user is authenticated (synchronous check of localStorage)
   */
  isAuthenticated(): boolean {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    return !!authData;
  }
}

export const authService = new AuthService();

