import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./mock-drill.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("mock_drill", "read", "dashboard"), ctrl.dashboard);
router.get("/drills", authorize("mock_drill", "read", "drill"), ctrl.listDrills);
router.post("/drills", authorize("mock_drill", "create", "drill"), ctrl.createDrill);
router.get("/drills/:id", authorize("mock_drill", "read", "drill"), ctrl.getDrill);
router.put("/drills/:id", authorize("mock_drill", "update", "drill"), ctrl.updateDrill);
router.get("/types", authorize("mock_drill", "read", "drill"), ctrl.listTypes);

export default router;
