import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";
import { Op } from "sequelize";
import { AuthRequest } from "../middleware/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Helper: Generate token
const generateToken = (user: User) => {
  const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any
  };
  return jwt.sign(payload, JWT_SECRET as string, options);
};

// Helper: User response without password
const userResponse = (user: User) => {
  const response = user.toJSON();
  delete response.password;
  return response;
};

// Helper: Check if user can modify target user
const canModifyUser = (requestingUser: User, targetUserId: number): boolean => {
  return requestingUser.role === "ADMIN" || requestingUser.id === targetUserId;
};

// POST /register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, status } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Username, email and password required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await User.findOne({
      where: { [Op.or]: [{ email }] }
    });

    if (existing) {
      res.status(409).json({ message: "email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "USER",
      status: status || "ACTIVE",
      inserts: 1,
      updates: 1,
      deletes: 1,
      cancels: 1
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse(user),
    });
  } catch (error: any) {
    console.error("REGISTER ERROR", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// POST /login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET /me
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({ data: userResponse(req.user!) });
};

// GET /users
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);
    const where: any = {};

    if (req.query.role) where.role = req.query.role;
    if (req.query.status) where.status = req.query.status;
    if (req.query.search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      data: rows,
      ...buildPaginationResponse(count, limit, page),
      orderBy,
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// GET /users/:id - FIXED: Remove base64, add authorization
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Authorization: Only admins or the user themselves can view full details
    if (!canModifyUser(req.user!, userId)) {
      res.status(403).json({ message: "Not authorized to view this user" });
      return;
    }

    res.status(200).json({ data: user });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// PUT /users/:id - FIXED: Remove base64, add authorization, require current password
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    // Authorization check
    if (!canModifyUser(req.user!, userId)) {
      res.status(403).json({ message: "Not authorized to update this user" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { username, email, password, currentPassword, role, status, inserts, updates, deletes, cancels } = req.body;

    // Password change requires current password (unless admin)
    if (password) {
      if (req.user!.role !== "ADMIN") {
        if (!currentPassword) {
          res.status(400).json({ message: "Current password required to change password" });
          return;
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          res.status(401).json({ message: "Current password is incorrect" });
          return;
        }
      }
      if (password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters" });
        return;
      }
    }


    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        res.status(409).json({ message: "Email already exists" });
        return;
      }
    }

    // Prepare update - Only admins can change role/status/permissions
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    if (req.user!.role === "ADMIN") {
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      if (inserts !== undefined) updateData.inserts = inserts;
      if (updates !== undefined) updateData.updates = updates;
      if (deletes !== undefined) updateData.deletes = deletes;
      if (cancels !== undefined) updateData.cancels = cancels;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);
    res.status(200).json({
      message: "User updated successfully",
      user: userResponse(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

// DELETE /users/:id - FIXED: Remove base64, add authorization
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    // Only admins can delete users (prevent self-deletion in client)
    if (req.user!.role !== "ADMIN") {
      res.status(403).json({ message: "Only admins can delete users" });
      return;
    }

    // Prevent deleting yourself
    if (req.user!.id === userId) {
      res.status(400).json({ message: "Cannot delete your own account" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// GET /users/options
export const getUserOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      where: { status: "ACTIVE" },
      attributes: ["id", "username", "email", "role"],
      order: [["username", "ASC"]],
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to get user options", error: error.message });
  }
};