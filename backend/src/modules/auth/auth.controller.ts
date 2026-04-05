import { Request, Response, NextFunction } from "express";
import { login, refresh, logout } from "./auth.service";
import { success, fail } from "../../utils/response";

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await login(req.body.email as string, req.body.password as string);
    success(res, result, "Login successful");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    fail(res, message, 401);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await refresh(req.body.refreshToken as string);
    success(res, result);
  } catch {
    fail(res, "Invalid refresh token", 401);
  }
}

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await logout(req.body.refreshToken as string);
    success(res, null, "Logged out");
  } catch {
    fail(res, "Logout failed");
  }
}
