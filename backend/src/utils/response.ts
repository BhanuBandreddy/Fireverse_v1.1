import { Response } from "express";

export const success = (
  res: Response,
  data: unknown,
  message = "OK",
  statusCode = 200
) => res.status(statusCode).json({ success: true, message, data });

export const paginated = (
  res: Response,
  data: unknown,
  page: number,
  limit: number,
  total: number
) =>
  res.status(200).json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });

export const fail = (res: Response, message: string, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });
