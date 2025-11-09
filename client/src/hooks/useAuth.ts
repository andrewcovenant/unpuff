import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginRequest, type SignupRequest, type GoogleSignInRequest } from "@/services/auth.service";
import type { User } from "@shared/schema";

/**
 * Query hook to get current authenticated user session
 * Also sets up real-time session listener for Supabase auth state changes
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Set up real-time auth state listener
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      // Update the query cache when auth state changes
      queryClient.setQueryData(["auth", "session"], user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery<User | null>({
    queryKey: ["auth", "session"],
    queryFn: () => authService.getSession(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false,
  });
}

/**
 * Mutation hook to login a user
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event("auth-complete"));
    },
  });
}

/**
 * Mutation hook to sign up a new user
 */
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, SignupRequest>({
    mutationFn: (credentials) => authService.signup(credentials),
    onSuccess: () => {
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Dispatch custom event for backward compatibility
      window.dispatchEvent(new Event("auth-complete"));
    },
  });
}

/**
 * Mutation hook to sign in with Google OAuth
 */
export function useGoogleSignIn() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, GoogleSignInRequest | undefined>({
    mutationFn: (options) => authService.signInWithGoogle(options),
    onSuccess: () => {
      // OAuth redirect will happen, so we don't invalidate queries here
      // The auth state listener will handle the update when user returns
    },
  });
}

/**
 * Mutation hook to logout current user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Supabase handles session cleanup, but we can clear any local state
      queryClient.setQueryData(["auth", "session"], null);
    },
  });
}

