import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'green-publishers-super-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password } = req.body;
      
      // Check if user already exists
      const existing = await sql`SELECT * FROM "User" WHERE email = ${email} OR phone = ${phone}`;
      if (existing.length > 0) {
        return res.status(400).json({ error: 'User with this email or phone already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await sql`
        INSERT INTO "User" (name, email, phone, password, role, "createdAt", "updatedAt")
        VALUES (${name}, ${email}, ${phone}, ${hashedPassword}, 'CUSTOMER', NOW(), NOW())
        RETURNING id, name, email, phone, role
      `;
      
      const user = result[0];
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { emailOrPhone, password } = req.body;

      const users = await sql`
        SELECT * FROM "User" 
        WHERE email = ${emailOrPhone} OR phone = ${emailOrPhone}
      `;
      
      const user = users[0];
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      // Remove password before sending
      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
}
