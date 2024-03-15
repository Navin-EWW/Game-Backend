import { Router } from "express";
import { SponsorController } from "../../../app/http/controllers/api/Website/Sponsor/SponsorController";


const router = Router();

router.get(
    "/",
    SponsorController.index
);

export default router;