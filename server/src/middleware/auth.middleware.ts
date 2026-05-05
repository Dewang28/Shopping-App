import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = bearerToken || req.cookies?.token;

    if (!token) return res.status(401).json({ message: "UNAUTHORIZED" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "INVALID_OR_EXPIRED_TOKEN" });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== "admin") {
    return res.status(403).end();
  }
  next();
};
