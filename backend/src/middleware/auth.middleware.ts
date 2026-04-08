import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JWTPayload } from "../utils/jwt";
import { fail } from "../utils/response";
import { prisma } from "../lib/prisma";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: JWTPayload & { permissions: string[] };
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    fail(res, "Unauthorized", 401);
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);

    // Fetch permissions from DB (JWT stays small — no permissions in token)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        roles: {
          select: {
            role: {
              select: {
                permissions: { select: { permission: true } },
              },
            },
          },
        },
      },
    });

    const permissions = user
      ? user.roles.flatMap((ur) =>
          ur.role.permissions.map(
            (rp) =>
              `${rp.permission.module}:${rp.permission.action}:${rp.permission.resource}`
          )
        )
      : [];

    req.user = { ...payload, permissions };
    next();
  } catch {
    fail(res, "Invalid or expired token", 401);
  }
}
