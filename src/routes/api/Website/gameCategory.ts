import { Router } from "express";
import { CategoryController } from "../../../app/http/controllers/api/Website/Categories/CategoryController";
import { verifyToken } from "../../../app/http/middleware/Auth";

const router = Router();

router.get("/list", CategoryController.list);

export default router;
