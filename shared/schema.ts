import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile table linked to Supabase Auth
// Password is handled by Supabase Auth, not stored here
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supabase_user_id: varchar("supabase_user_id").notNull().unique(), // Links to Supabase Auth user
  username: text("username"), // Optional, can be derived from email or set separately
  email: text("email").notNull(), // Email from Supabase Auth
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  supabase_user_id: true,
  username: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
