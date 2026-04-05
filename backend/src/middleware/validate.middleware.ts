import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { fail } from "../utils/response";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues
        .map((e: { path: (string | number)[]; message: string }) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      fail(res, msg, 400);
      return;
    }
    req.body = result.data;
    next();
  };
}
