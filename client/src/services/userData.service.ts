import { z } from "zod";

const USERDATA_STORAGE_KEY = "unpuff-userdata";

const userDataSchema = z.object({
  identity: z.string(),
  triggers: z.array(z.string()),
  dailyBaseline: z.number(),
  dailyGoal: z.number(),
});

export type UserData = z.infer<typeof userDataSchema>;

export class UserDataService {
  /**
   * Get user data from localStorage
   */
  getUserData(): UserData | null {
    try {
      const stored = localStorage.getItem(USERDATA_STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      // Validate with Zod schema
      return userDataSchema.parse(parsed);
    } catch (error) {
      // If parsing or validation fails, clear invalid data
      console.error("Failed to parse user data:", error);
      localStorage.removeItem(USERDATA_STORAGE_KEY);
      return null;
    }
  }

  /**
   * Set user data in localStorage with validation
   */
  setUserData(data: UserData): void {
    try {
      // Validate data before storing
      const validated = userDataSchema.parse(data);
      localStorage.setItem(USERDATA_STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid user data: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw new Error("Failed to save user data");
    }
  }

  /**
   * Clear user data from localStorage
   */
  clearUserData(): void {
    localStorage.removeItem(USERDATA_STORAGE_KEY);
  }

  /**
   * Check if user data exists (synchronous check)
   */
  hasUserData(): boolean {
    return !!localStorage.getItem(USERDATA_STORAGE_KEY);
  }
}

export const userDataService = new UserDataService();

