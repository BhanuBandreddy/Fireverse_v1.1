import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./vehicle-gps.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("vehicle_gps", "read", "dashboard"), ctrl.dashboard);
router.get("/vehicles", authorize("vehicle_gps", "read", "vehicle"), ctrl.listVehicles);
router.post("/vehicles", authorize("vehicle_gps", "create", "vehicle"), ctrl.createVehicle);
router.get("/vehicles/:id", authorize("vehicle_gps", "read", "vehicle"), ctrl.getVehicle);
router.put("/vehicles/:id", authorize("vehicle_gps", "update", "vehicle"), ctrl.updateVehicle);
router.get("/inspections", authorize("vehicle_gps", "read", "vehicle"), ctrl.listInspections);
router.post("/inspections", authorize("vehicle_gps", "create", "vehicle"), ctrl.createInspection);
router.get("/discrepancies", authorize("vehicle_gps", "read", "vehicle"), ctrl.listDiscrepancies);
router.get("/gps-logs/:vehicleId", authorize("vehicle_gps", "read", "gps"), ctrl.getGPSLogs);

export default router;
