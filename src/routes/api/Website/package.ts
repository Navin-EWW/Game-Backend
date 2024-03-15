import { Router } from "express";
import { GamePackagesController } from "../../../app/http/controllers/api/Website/GamePackages/GamePackagesController";
import { userVerifyToken } from "../../../app/http/middleware/Auth";


const router = Router();

router.get(
    "/",
    GamePackagesController.index
);

router.get(
    "/user-package",
    userVerifyToken,
    GamePackagesController.userPackage
);

export default router;