import { Router } from "express";
import { loginHandler, refreshHandler, logoutHandler } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { LoginSchema, RefreshSchema } from "./auth.schema";

const router = Router();

router.post("/login", validate(LoginSchema), loginHandler);
router.post("/refresh", validate(RefreshSchema), refreshHandler);
router.post("/logout", validate(RefreshSchema), logoutHandler);

export default router;
