import { Request, Response, NextFunction } from "express";
import * as svc from "./audit.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listAudits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getAudits(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getAudit(req.params["id"]!);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createAudit(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateAudit(req.params["id"]!, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function listObservations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getObservations(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createObservation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createObservation(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function closeObservation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.closeObservation(req.params["id"]!), "Closed"); } catch (e) { next(e); }
}

export async function listTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getInspectionTypes()); } catch (e) { next(e); }
}
