import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import * as ctrl from "./equipment.controller";

const router = Router();
router.use(authenticate);

router.get("/dashboard", authorize("equipment", "read", "dashboard"), ctrl.dashboard);
router.get("/items", authorize("equipment", "read", "equipment"), ctrl.listItems);
router.post("/items", authorize("equipment", "create", "equipment"), ctrl.createItem);
router.put("/items/:id", authorize("equipment", "update", "equipment"), ctrl.updateItem);
router.get("/warehouses", authorize("equipment", "read", "equipment"), ctrl.listWarehouses);
router.post("/warehouses", authorize("equipment", "create", "equipment"), ctrl.createWarehouse);
router.get("/requisitions", authorize("equipment", "read", "equipment"), ctrl.listRequisitions);
router.post("/requisitions", authorize("equipment", "create", "equipment"), ctrl.createRequisition);
router.get("/assets", authorize("equipment", "read", "equipment"), ctrl.listAssets);
router.post("/assets", authorize("equipment", "create", "equipment"), ctrl.createAsset);

export default router;
