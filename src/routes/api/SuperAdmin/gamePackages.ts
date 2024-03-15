import { Router } from "express";
import { GamePackagesController } from "../../../app/http/controllers/api/SuperAdmin/GamePackages/GamePackagesController";
import { RequestParamsValidator, RequestQueryValidator, RequestSortValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { GamePackagesFilterRequest, GamePackagesRequest, GamePackagesStatusRequest, GamePackagesUpdateRequest, IdQueryRequest } from "../../../app/http/requests/GamePackagesRequest";
import { verifyToken } from "../../../app/http/middleware/Auth";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";

const router = Router();

router.post(
  "/",
  verifyToken,
  RequestValidator(GamePackagesRequest),
  GamePackagesController.addGamePackages
);

router.get(
  "/list",
  verifyToken,
  paginationCleaner,
  RequestQueryValidator(GamePackagesFilterRequest),
  RequestSortValidator(["id", "title", "description", "createdAt"]),
  GamePackagesController.index
);

router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(GamePackagesUpdateRequest),
    GamePackagesController.updateGamePackages
)
router.get(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    GamePackagesController.findGamePackagesById
)
router.delete(
    "/delete/:id",
    RequestParamsValidator(IdQueryRequest),
    GamePackagesController.deleteGamePackagesById
)

router.put(
    "/status/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(GamePackagesStatusRequest),
    GamePackagesController.updateStatusGamePackages
)

export default router;
