import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./renewal.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("renewal", "read", "dashboard"), ctrl.dashboard);
router.get("/firms", authorize("renewal", "read", "firm"), ctrl.listFirms);
router.post("/firms", authorize("renewal", "create", "firm"), ctrl.createFirm);
router.get("/applications", authorize("renewal", "read", "renewal"), ctrl.listApplications);
router.post("/applications", authorize("renewal", "create", "renewal"), ctrl.createApplication);
router.get("/applications/:id", authorize("renewal", "read", "renewal"), ctrl.getApplication);
router.put("/applications/:id", authorize("renewal", "update", "renewal"), ctrl.updateApplication);

export default router;
