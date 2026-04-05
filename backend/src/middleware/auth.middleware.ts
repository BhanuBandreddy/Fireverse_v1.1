import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JWTPayload } from "../utils/jwt";
import { fail } from "../utils/response";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: JWTPayload;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    fail(res, "Unauthorized", 401);
    return;
  }
  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    fail(res, "Invalid or expired token", 401);
  }
}
