import { Request, Response, NextFunction } from "express";
import * as svc from "./equipment.service";
import { success, paginated } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getItems(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createItem(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateItem(req.params["id"]!, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function listWarehouses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getWarehouses(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createWarehouse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createWarehouse(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listRequisitions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getRequisitions(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createRequisition(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createRequisition(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function listAssets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getAssets(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createAsset(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}
