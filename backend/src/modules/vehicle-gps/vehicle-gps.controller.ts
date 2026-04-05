import { Request, Response, NextFunction } from "express";
import * as svc from "./vehicle-gps.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getVehicles(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getVehicle(req.params["id"]!);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createVehicle(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateVehicle(req.params["id"]!, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function listInspections(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getInspections(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createInspection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createInspection(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listDiscrepancies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getDiscrepancies(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getGPSLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getGPSLogs(req.params["vehicleId"]!)); } catch (e) { next(e); }
}
