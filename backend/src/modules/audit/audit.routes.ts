import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./audit.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("audit", "read", "dashboard"), ctrl.dashboard);
router.get("/audits", authorize("audit", "read", "audit"), ctrl.listAudits);
router.post("/audits", authorize("audit", "create", "audit"), ctrl.createAudit);
router.get("/audits/:id", authorize("audit", "read", "audit"), ctrl.getAudit);
router.put("/audits/:id", authorize("audit", "update", "audit"), ctrl.updateAudit);
router.get("/observations", authorize("audit", "read", "audit"), ctrl.listObservations);
router.post("/observations", authorize("audit", "create", "audit"), ctrl.createObservation);
router.put("/observations/:id/close", authorize("audit", "update", "audit"), ctrl.closeObservation);
router.get("/types", authorize("audit", "read", "audit"), ctrl.listTypes);

export default router;
