import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginRequest, type SignupRequest } from "@/services/auth.service";
import type { User } from "@shared/schema";

/**
 * Query hook to get current authenticated user session
 */
export function useAuth() {
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
 * Mutation hook to logout current user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Remove all localStorage items related to auth
      localStorage.removeItem("unpuff-auth");
    },
  });
}

