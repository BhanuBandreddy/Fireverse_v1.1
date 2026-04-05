import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./fire-admin.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("fire_admin", "read", "dashboard"), ctrl.dashboard);
router.get("/employees", authorize("fire_admin", "read", "employee"), ctrl.listEmployees);
router.post("/employees", authorize("fire_admin", "create", "employee"), ctrl.createEmployee);
router.get("/employees/:id", authorize("fire_admin", "read", "employee"), ctrl.getEmployee);
router.put("/employees/:id", authorize("fire_admin", "update", "employee"), ctrl.updateEmployee);
router.delete("/employees/:id", authorize("fire_admin", "delete", "employee"), ctrl.deleteEmployee);
router.get("/departments", authorize("fire_admin", "read", "department"), ctrl.listDepartments);
router.post("/departments", authorize("fire_admin", "create", "department"), ctrl.createDepartment);
router.put("/departments/:id", authorize("fire_admin", "update", "department"), ctrl.updateDepartment);
router.delete("/departments/:id", authorize("fire_admin", "delete", "department"), ctrl.deleteDepartment);
router.get("/users", authorize("fire_admin", "read", "user"), ctrl.listUsers);
router.get("/roles", authorize("fire_admin", "read", "role"), ctrl.listRoles);

export default router;
