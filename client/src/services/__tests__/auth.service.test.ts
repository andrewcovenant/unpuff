import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService, AuthError, NetworkError } from "../auth.service";
import type { User } from "@shared/schema";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock apiRequest helper
vi.mock("@/lib/queryClient", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/lib/queryClient";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login and store auth data", async () => {
      const mockUser: User = {
        id: "123",
        username: "testuser",
        password: "hashed",
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockUser),
      };

      (apiRequest as any).mockResolvedValue(mockResponse);

      const result = await authService.login({
        username: "testuser",
        password: "password",
      });

      expect(result).toEqual(mockUser);
      expect(localStorage.getItem("unpuff-auth")).toBeTruthy();
      const storedAuth = JSON.parse(localStorage.getItem("unpuff-auth")!);
      expect(storedAuth.userId).toBe("123");
      expect(storedAuth.username).toBe("testuser");
    });

    it("should throw AuthError on 401", async () => {
      const error = new Error("401: Invalid credentials");
      (apiRequest as any).mockRejectedValue(error);

      await expect(
        authService.login({
          username: "testuser",
          password: "wrongpassword",
        }),
      ).rejects.toThrow(AuthError);
    });

    it("should throw NetworkError on network failure", async () => {
      const error = new Error("Failed to fetch");
      (apiRequest as any).mockRejectedValue(error);

      await expect(
        authService.login({
          username: "testuser",
          password: "password",
        }),
      ).rejects.toThrow(NetworkError);
    });
  });

  describe("signup", () => {
    it("should successfully sign up and store auth data", async () => {
      const mockUser: User = {
        id: "456",
        username: "newuser",
        password: "hashed",
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockUser),
      };

      (apiRequest as any).mockResolvedValue(mockResponse);

      const result = await authService.signup({
        username: "newuser",
        password: "password",
      });

      expect(result).toEqual(mockUser);
      expect(localStorage.getItem("unpuff-auth")).toBeTruthy();
    });

    it("should throw AuthError on 400 (username exists)", async () => {
      const error = new Error("400: Username already exists");
      (apiRequest as any).mockRejectedValue(error);

      await expect(
        authService.signup({
          username: "existinguser",
          password: "password",
        }),
      ).rejects.toThrow(AuthError);
    });
  });

  describe("getSession", () => {
    it("should return null when no auth data in localStorage", async () => {
      const result = await authService.getSession();
      expect(result).toBeNull();
    });

    it("should return user when valid session exists", async () => {
      localStorage.setItem(
        "unpuff-auth",
        JSON.stringify({ userId: "123", username: "testuser" }),
      );

      const mockUser: User = {
        id: "123",
        username: "testuser",
        password: "hashed",
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUser),
      });

      const result = await authService.getSession();
      expect(result).toEqual(mockUser);
    });

    it("should return null and clear localStorage on 401", async () => {
      localStorage.setItem(
        "unpuff-auth",
        JSON.stringify({ userId: "123", username: "testuser" }),
      );

      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
      });

      const result = await authService.getSession();
      expect(result).toBeNull();
      expect(localStorage.getItem("unpuff-auth")).toBeNull();
    });

    it("should return null on network error", async () => {
      localStorage.setItem(
        "unpuff-auth",
        JSON.stringify({ userId: "123", username: "testuser" }),
      );

      (global.fetch as any).mockRejectedValue(new Error("Failed to fetch"));

      const result = await authService.getSession();
      expect(result).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear auth data from localStorage", async () => {
      localStorage.setItem(
        "unpuff-auth",
        JSON.stringify({ userId: "123", username: "testuser" }),
      );

      await authService.logout();

      expect(localStorage.getItem("unpuff-auth")).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return false when no auth data", () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("should return true when auth data exists", () => {
      localStorage.setItem(
        "unpuff-auth",
        JSON.stringify({ userId: "123", username: "testuser" }),
      );

      expect(authService.isAuthenticated()).toBe(true);
    });
  });
});

