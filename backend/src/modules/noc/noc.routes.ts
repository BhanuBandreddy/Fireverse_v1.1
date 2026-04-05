import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./noc.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("noc", "read", "dashboard"), ctrl.dashboard);
router.get("/applications", authorize("noc", "read", "noc_application"), ctrl.listApplications);
router.post("/applications", authorize("noc", "create", "noc_application"), ctrl.createApplication);
router.get("/applications/:id", authorize("noc", "read", "noc_application"), ctrl.getApplication);
router.put("/applications/:id", authorize("noc", "update", "noc_application"), ctrl.updateApplication);
router.delete("/applications/:id", authorize("noc", "delete", "noc_application"), ctrl.deleteApplication);
router.get("/certificates", authorize("noc", "read", "noc_certificate"), ctrl.listCertificates);
router.get("/fees", authorize("noc", "read", "noc_fee"), ctrl.listFees);

export default router;
