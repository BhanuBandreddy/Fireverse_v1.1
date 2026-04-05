import { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response";

export function authorize(module: string, action: string, resource: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const perm = `${module}:${action}:${resource}`;
    if (
      req.user.roles.includes("SUPER_ADMIN") ||
      req.user.permissions.includes(perm)
    ) {
      next();
      return;
    }
    fail(res, "Insufficient permissions", 403);
  };
}
