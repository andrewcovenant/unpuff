import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useAuth, useLogin, useSignup, useLogout } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import type { User } from "@shared/schema";

// Mock AuthService
vi.mock("../../services/auth.service", () => ({
  authService: {
    getSession: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch session on mount", async () => {
    const mockUser: User = {
      id: "123",
      username: "testuser",
      password: "hashed",
    };

    (authService.getSession as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(authService.getSession).toHaveBeenCalledTimes(1);
  });

  it("should return null when no session", async () => {
    (authService.getSession as any).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
  });
});

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call authService.login and invalidate queries on success", async () => {
    const mockUser: User = {
      id: "123",
      username: "testuser",
      password: "hashed",
    };

    (authService.login as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      username: "testuser",
      password: "password",
    });

    expect(authService.login).toHaveBeenCalledWith({
      username: "testuser",
      password: "password",
    });
  });

  it("should handle errors", async () => {
    const error = new Error("Login failed");
    (authService.login as any).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        username: "testuser",
        password: "wrongpassword",
      }),
    ).rejects.toThrow("Login failed");
  });
});

describe("useSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call authService.signup on success", async () => {
    const mockUser: User = {
      id: "456",
      username: "newuser",
      password: "hashed",
    };

    (authService.signup as any).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      username: "newuser",
      password: "password",
    });

    expect(authService.signup).toHaveBeenCalledWith({
      username: "newuser",
      password: "password",
    });
  });
});

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call authService.logout", async () => {
    (authService.logout as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });
});

