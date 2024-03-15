import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../app/http/middleware/RequestValidator";
import { BlogsController } from "../../../app/http/controllers/api/SuperAdmin/Blogs/BlogsController";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { UserController } from "../../../app/http/controllers/api/SuperAdmin/Users/UserController";
import {
  UpdateUsersRequest,
  UserFilterRequest,
  UserStatusRequest,
} from "../../../app/http/requests/UserRequest";
import { verifyToken } from "../../../app/http/middleware/Auth";

const router = Router();

router.get(
  "/",
  paginationCleaner,
  verifyToken,
  RequestQueryValidator(UserFilterRequest),
  RequestSortValidator([
    "id",
    "firstName",
    "lastName",
    "displayPhoneNumber",
    "email",
    "createdAt",
  ]),
  UserController.index
);

router.put(
  "/:id",
  verifyToken,
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(UpdateUsersRequest),
  UserController.update
);

router.put(
  "/delete/:id",
  verifyToken,
  RequestParamsValidator(IdQueryRequest),
  UserController.delete
);

router.put(
  "/status/:id",
  verifyToken,
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(UserStatusRequest),
  UserController.status
);

router.get(
  "/:id",
  verifyToken,
  RequestParamsValidator(IdQueryRequest),
  UserController.view
);


router.get(
  "/game-history/:id",
  RequestParamsValidator(IdQueryRequest),
  UserController.gameHistory
)

router.get(
  "/special-game-history/:id",
  RequestParamsValidator(IdQueryRequest),
  UserController.specialGameHistory
)

router.get(
  "/game-package-count/:id",
  RequestParamsValidator(IdQueryRequest),
  UserController.gamepackageCount
)


router.get(
  "/game-packages/:id",
  RequestParamsValidator(IdQueryRequest),
  UserController.gamepackages
)
export default router;
