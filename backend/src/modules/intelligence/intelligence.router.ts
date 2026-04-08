import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { queryIntelligence, getExecutiveSummary } from "./intelligence.service";

const router = Router();

// Protect all intelligence endpoints
router.use(authenticate);

/**
 * POST /api/intelligence/query
 * Body: { query: string }
 * Returns natural-language intelligence result with optional data and chart.
 */
router.post("/query", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.body as { query?: string };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body must include a non-empty 'query' string.",
      });
      return;
    }

    const result = await queryIntelligence(query.trim());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/intelligence/summary
 * Returns executive KPI summary with alerts for the dashboard.
 */
router.get("/summary", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getExecutiveSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
