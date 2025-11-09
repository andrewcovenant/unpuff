import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes have been removed - authentication is now handled by Supabase client-side
  // Supabase Auth handles signup, login, OAuth, and session management
  // If you need server-side user verification, use Supabase JWT verification middleware

  // Example: Protected route with Supabase JWT verification
  // app.get("/api/protected", async (req: Request, res: Response) => {
  //   const token = req.headers.authorization?.replace("Bearer ", "");
  //   if (!token) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
  //   // Verify token with Supabase
  //   // const { data: { user }, error } = await supabase.auth.getUser(token);
  //   // ...
  // });

  const httpServer = createServer(app);

  return httpServer;
}
