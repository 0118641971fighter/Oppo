import { type User, type InsertUser, type Violation, type InsertViolation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllViolations(): Promise<Violation[]>;
  getViolation(id: number): Promise<Violation | undefined>;
  createViolation(violation: InsertViolation): Promise<Violation>;
  updateViolation(id: number, violation: InsertViolation): Promise<Violation | undefined>;
  deleteViolation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private violations: Map<number, Violation>;
  private violationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.violations = new Map();
    this.violationIdCounter = 1;
    
    this.createUser({ username: 'admin', password: '1234' });
    
    const initialViolations = [
      'الخروج من الصاله ب3 منديل',
      'الخروج من الصاله ب2 منديل + سجائر + التحدث الغير لائق مع الاداره',
      'الخروج من الصاله ب2 منديل +اسم خطأ',
      'حلوى + ابلاغ الاسم خطأ + ابلاغ مره اخري اسم خطأ',
      'دخول ب محفظه بدون علم (أول مره)',
    ];
    
    initialViolations.forEach(text => {
      this.createViolation({ text });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllViolations(): Promise<Violation[]> {
    return Array.from(this.violations.values()).sort((a, b) => a.id - b.id);
  }

  async getViolation(id: number): Promise<Violation | undefined> {
    return this.violations.get(id);
  }

  async createViolation(violation: InsertViolation): Promise<Violation> {
    const id = this.violationIdCounter++;
    const newViolation: Violation = { id, ...violation };
    this.violations.set(id, newViolation);
    return newViolation;
  }

  async updateViolation(id: number, violation: InsertViolation): Promise<Violation | undefined> {
    const existing = this.violations.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Violation = { ...existing, ...violation };
    this.violations.set(id, updated);
    return updated;
  }

  async deleteViolation(id: number): Promise<boolean> {
    return this.violations.delete(id);
  }
}

export const storage = new MemStorage();
