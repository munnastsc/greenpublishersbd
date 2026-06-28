"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || 'green-publishers-super-secret-key';
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, phone, password } = req.body;
            // Check if user already exists
            const existing = await (0, db_1.sql) `SELECT * FROM "User" WHERE email = ${email} OR phone = ${phone}`;
            if (existing.length > 0) {
                return res.status(400).json({ error: 'User with this email or phone already exists' });
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Create user
            const result = await (0, db_1.sql) `
        INSERT INTO "User" (name, email, phone, password, role, "createdAt", "updatedAt")
        VALUES (${name}, ${email}, ${phone}, ${hashedPassword}, 'CUSTOMER', NOW(), NOW())
        RETURNING id, name, email, phone, role
      `;
            const user = result[0];
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ user, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
    static async login(req, res) {
        try {
            const { emailOrPhone, password } = req.body;
            const users = await (0, db_1.sql) `
        SELECT * FROM "User" 
        WHERE email = ${emailOrPhone} OR phone = ${emailOrPhone}
      `;
            const user = users[0];
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isValid = await bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            // Remove password before sending
            const { password: _, ...safeUser } = user;
            res.json({ user: safeUser, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
}
exports.AuthController = AuthController;
