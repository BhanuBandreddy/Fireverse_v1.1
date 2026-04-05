import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./training.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("training", "read", "dashboard"), ctrl.dashboard);
router.get("/schedules", authorize("training", "read", "training"), ctrl.listSchedules);
router.post("/schedules", authorize("training", "create", "training"), ctrl.createSchedule);
router.get("/schedules/:id", authorize("training", "read", "training"), ctrl.getSchedule);
router.put("/schedules/:id", authorize("training", "update", "training"), ctrl.updateSchedule);
router.get("/courses", authorize("training", "read", "training"), ctrl.listCourses);
router.post("/courses", authorize("training", "create", "training"), ctrl.createCourse);

export default router;
