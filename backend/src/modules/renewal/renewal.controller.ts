import { Request, Response, NextFunction } from "express";
import * as svc from "./renewal.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listFirms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getFirms(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createFirm(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createFirm(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getApplications(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getApplication(req.params["id"]!);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createApplication(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateApplication(req.params["id"]!, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}
