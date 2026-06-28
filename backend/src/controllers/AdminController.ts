import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../db';

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Check if user exists
      const users = await sql`SELECT * FROM "User" WHERE email = ${email} LIMIT 1`;
      const user = users[0] as any;

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In the Next.js app, passwords might be plain text or hashed differently based on seed.
      // We will try bcrypt compare first, if that fails, maybe plain text comparison for fallback during migration.
      let isMatch = false;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        // Fallback for plain text if they haven't hashed them yet
        isMatch = password === user.password;
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'super_secret_key_change_this_in_production',
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  }

  static async getDashboardStats(req: Request, res: Response) {
    try {
      const totalBooks = await sql`SELECT COUNT(*) FROM "Book"`;
      const totalOrders = await sql`SELECT COUNT(*) FROM "Order"`;
      const pendingOrders = await sql`SELECT COUNT(*) FROM "Order" WHERE status = 'PENDING'`;
      const totalUsers = await sql`SELECT COUNT(*) FROM "User"`;

      res.json({
        books: parseInt(totalBooks[0].count),
        orders: parseInt(totalOrders[0].count),
        pendingOrders: parseInt(pendingOrders[0].count),
        users: parseInt(totalUsers[0].count)
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  }
}
