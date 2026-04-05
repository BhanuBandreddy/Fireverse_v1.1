import { Request, Response, NextFunction } from "express";
import * as svc from "./fire-admin.service";
import { success, paginated, fail } from "../../utils/response";
import { getPagination } from "../../utils/pagination";

export async function dashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getDashboardStats()); } catch (e) { next(e); }
}

export async function listEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getEmployees(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function getEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.getEmployee(req.params["id"] as string);
    if (!item) { fail(res, "Not found", 404); return; }
    success(res, item);
  } catch (e) { next(e); }
}

export async function createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createEmployee(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateEmployee(req.params["id"] as string, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.deleteEmployee(req.params["id"] as string), "Deleted"); } catch (e) { next(e); }
}

export async function listDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getDepartments(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.createDepartment(req.body as Record<string, unknown>), "Created", 201); } catch (e) { next(e); }
}

export async function updateDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.updateDepartment(req.params["id"] as string, req.body as Record<string, unknown>)); } catch (e) { next(e); }
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.deleteDepartment(req.params["id"] as string), "Deleted"); } catch (e) { next(e); }
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip, search } = getPagination(req.query as Record<string, string>);
    const { data, total } = await svc.getUsers(skip, limit, search);
    paginated(res, data, page, limit, total);
  } catch (e) { next(e); }
}

export async function listRoles(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { success(res, await svc.getRoles()); } catch (e) { next(e); }
}
