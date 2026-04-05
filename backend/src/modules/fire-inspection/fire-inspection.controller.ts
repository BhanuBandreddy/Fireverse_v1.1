import { Request, Response, NextFunction } from "express";
import * as svc from "./fire-inspection.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listScheduled(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getScheduledInspections(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getScheduled(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getScheduledInspection(req.params["id"]!);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createScheduled(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createScheduledInspection(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listChecklists(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getChecklists(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createChecklist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createChecklist(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listDeviations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getDeviations(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function updateDeviation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateDeviation(req.params["id"]!, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}
