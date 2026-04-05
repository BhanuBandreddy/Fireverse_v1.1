import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./fire-inspection.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("fire_inspection", "read", "dashboard"), ctrl.dashboard);
router.get("/scheduled", authorize("fire_inspection", "read", "inspection"), ctrl.listScheduled);
router.post("/scheduled", authorize("fire_inspection", "create", "inspection"), ctrl.createScheduled);
router.get("/scheduled/:id", authorize("fire_inspection", "read", "inspection"), ctrl.getScheduled);
router.get("/checklists", authorize("fire_inspection", "read", "checklist"), ctrl.listChecklists);
router.post("/checklists", authorize("fire_inspection", "create", "checklist"), ctrl.createChecklist);
router.get("/deviations", authorize("fire_inspection", "read", "deviation"), ctrl.listDeviations);
router.put("/deviations/:id", authorize("fire_inspection", "update", "deviation"), ctrl.updateDeviation);

export default router;
