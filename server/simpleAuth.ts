import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Simple development authentication bypass
export function setupSimpleAuth(app: Express) {
  // Mock user for development
  app.get("/api/login", (req, res) => {
    res.redirect("/?dev=true");
  });

  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      // Create or get a development user
      const devUser = await storage.upsertUser({
        id: "dev-user-123",
        email: "dev@aloha-shield.ai",
        firstName: "Development",
        lastName: "User",
        profileImageUrl: "https://via.placeholder.com/150"
      });
      
      res.json(devUser);
    } catch (error) {
      console.error("Error creating dev user:", error);
      res.status(500).json({ message: "Failed to create dev user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For development, always pass authentication
  next();
};