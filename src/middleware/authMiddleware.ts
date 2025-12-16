import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// 1️⃣ JWT secret must be set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: User;
}

export type PermissionType = "inserts" | "updates" | "deletes" | "cancels";

interface JwtPayload {
  id: number;
  iat?: number;
  exp?: number;
}

// -------------------
// Authenticate middleware
// -------------------
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.replace(/^Bearer\s/, "");
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.status !== "ACTIVE") {
      return res.status(403).json({ message: "User inactive or access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// -------------------
// Permission middleware
// -------------------
export const checkPermission = (permission: PermissionType) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Check permission" });
    }

    const hasPermission = req.user[permission];
    if (!hasPermission || hasPermission != 1) {
      return res.status(403).json({ message: `No ${permission} permission 555` });
    }

    next();
  };
};

// -------------------
// Role middleware
// -------------------
export const checkRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.user.role?.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
