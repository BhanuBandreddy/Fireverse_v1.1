import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./incident.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("incident", "read", "dashboard"), ctrl.dashboard);
router.get("/list", authorize("incident", "read", "incident"), ctrl.listIncidents);
router.post("/list", authorize("incident", "create", "incident"), ctrl.createIncident);
router.get("/list/:id", authorize("incident", "read", "incident"), ctrl.getIncident);
router.put("/list/:id", authorize("incident", "update", "incident"), ctrl.updateIncident);
router.delete("/list/:id", authorize("incident", "delete", "incident"), ctrl.deleteIncident);
router.get("/types", authorize("incident", "read", "incident"), ctrl.listTypes);
router.get("/categories", authorize("incident", "read", "incident"), ctrl.listCategories);

export default router;
