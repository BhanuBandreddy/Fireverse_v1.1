import { Request, Response, NextFunction } from "express";
import * as svc from "./training.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listSchedules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getSchedules(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getSchedule(req.params["id"] as string);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createSchedule(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateSchedule(req.params["id"] as string, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function listCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getCourses(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createCourse(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}
