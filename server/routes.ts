import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertViolationSchema } from "@shared/schema";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "يجب تسجيل الدخول أولاً" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "اسم المستخدم وكلمة المرور مطلوبان" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      req.session.userId = user.id;
      
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "خطأ في الخادم" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "خطأ في تسجيل الخروج" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/violations", requireAuth, async (req, res) => {
    try {
      const violations = await storage.getAllViolations();
      res.json(violations);
    } catch (error) {
      console.error('Get violations error:', error);
      res.status(500).json({ error: "خطأ في جلب المخالفات" });
    }
  });

  app.post("/api/violations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertViolationSchema.parse(req.body);
      const violation = await storage.createViolation(validatedData);
      res.status(201).json(violation);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "بيانات غير صحيحة" });
      }
      console.error('Create violation error:', error);
      res.status(500).json({ error: "خطأ في إضافة المخالفة" });
    }
  });

  app.put("/api/violations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "معرف غير صحيح" });
      }

      const validatedData = insertViolationSchema.parse(req.body);
      const violation = await storage.updateViolation(id, validatedData);
      
      if (!violation) {
        return res.status(404).json({ error: "المخالفة غير موجودة" });
      }

      res.json(violation);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "بيانات غير صحيحة" });
      }
      console.error('Update violation error:', error);
      res.status(500).json({ error: "خطأ في تعديل المخالفة" });
    }
  });

  app.delete("/api/violations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "معرف غير صحيح" });
      }

      const deleted = await storage.deleteViolation(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "المخالفة غير موجودة" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Delete violation error:', error);
      res.status(500).json({ error: "خطأ في حذف المخالفة" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
