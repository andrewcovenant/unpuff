import { createClient } from "@supabase/supabase-js";
import { type User, type InsertUser } from "@shared/schema";

// Storage interface for user profile management
// Note: User authentication is handled by Supabase Auth
// This storage layer is for managing user profiles in the database

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserBySupabaseId(supabaseUserId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// Supabase storage implementation
export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials not found. Storage operations will fail.");
    }

    this.supabase = supabaseUrl && supabaseKey
      ? createClient(supabaseUrl, supabaseKey)
      : null;
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return undefined;
    }

    return data as User;
  }

  async getUserBySupabaseId(supabaseUserId: string): Promise<User | undefined> {
    if (!this.supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("supabase_user_id", supabaseUserId)
      .single();

    if (error || !data) {
      return undefined;
    }

    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!this.supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return undefined;
    }

    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!this.supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await this.supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create user: No data returned");
    }

    return data as User;
  }
}

// Fallback to in-memory storage if Supabase is not configured
export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserBySupabaseId(supabaseUserId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.supabase_user_id === supabaseUserId,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = {
      ...insertUser,
      id,
      created_at: new Date(),
    };
    this.users.set(id, user);
    return user;
  }
}

// Use Supabase storage if configured, otherwise fall back to memory storage
const useSupabase = !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
export const storage = useSupabase ? new SupabaseStorage() : new MemStorage();
