"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
class AdminController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            // Check if user exists
            const users = await (0, db_1.sql) `SELECT * FROM "User" WHERE email = ${email} LIMIT 1`;
            const user = users[0];
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // In the Next.js app, passwords might be plain text or hashed differently based on seed.
            // We will try bcrypt compare first, if that fails, maybe plain text comparison for fallback during migration.
            let isMatch = false;
            try {
                isMatch = await bcrypt_1.default.compare(password, user.password);
            }
            catch (e) {
                // Fallback for plain text if they haven't hashed them yet
                isMatch = password === user.password;
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Generate JWT Token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'super_secret_key_change_this_in_production', { expiresIn: '1d' });
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
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error during login' });
        }
    }
    static async getDashboardStats(req, res) {
        try {
            const totalBooks = await (0, db_1.sql) `SELECT COUNT(*) FROM "Book"`;
            const totalOrders = await (0, db_1.sql) `SELECT COUNT(*) FROM "Order"`;
            const pendingOrders = await (0, db_1.sql) `SELECT COUNT(*) FROM "Order" WHERE status = 'PENDING'`;
            const totalUsers = await (0, db_1.sql) `SELECT COUNT(*) FROM "User"`;
            res.json({
                books: parseInt(totalBooks[0].count),
                orders: parseInt(totalOrders[0].count),
                pendingOrders: parseInt(pendingOrders[0].count),
                users: parseInt(totalUsers[0].count)
            });
        }
        catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
        }
    }
}
exports.AdminController = AdminController;
