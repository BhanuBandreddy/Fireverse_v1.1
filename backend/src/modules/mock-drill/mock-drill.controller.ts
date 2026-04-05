import { Request, Response, NextFunction } from "express";
import * as svc from "./mock-drill.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listDrills(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getDrills(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getDrill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getDrill(req.params["id"] as string);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createDrill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createDrill(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateDrill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateDrill(req.params["id"] as string, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function listTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDrillTypes()); } catch (e) { next(e); }
}
