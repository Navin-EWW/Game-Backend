import { Router } from "express";
import { DashboardController } from "../../../app/http/controllers/api/SuperAdmin/Dashboard/Dashboard";

const router = Router();

router.get("/", DashboardController.dashboard);

export default router;
