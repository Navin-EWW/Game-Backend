import { Router } from "express";

import { RequestParamsValidator, RequestQueryValidator, RequestSortValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { GameCategoryAddRequest } from "../../../app/http/requests/GameCategoryAddRequest";
import { GameCategoryController } from "../../../app/http/controllers/api/SuperAdmin/GameCategory/GameCategoryController";
import { GameCategoryUpdateRequest } from "../../../app/http/requests/GameCategoryUpdateRequest";
import { StatusUpdateRequest } from "../../../app/http/requests/StatusUpdateRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { GameCategoryFilterRequest } from "../../../app/http/requests/GameCategoryFilterRequest";


const router = Router();

router.get(
    "/",
    paginationCleaner,
    RequestQueryValidator(GameCategoryFilterRequest),
    RequestSortValidator(["id", "name", "description","createdAt"]),
    GameCategoryController.index
);

router.post(
    "/",
    RequestValidator(GameCategoryAddRequest),
    GameCategoryController.addCategory
)

router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(GameCategoryUpdateRequest),
    GameCategoryController.updateCategory
)

router.delete(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    GameCategoryController.deleteCategory
)

router.put(
    "/status/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(StatusUpdateRequest),
    GameCategoryController.statusChange
)

router.get(
    "/category-count/:id",
    RequestParamsValidator(IdQueryRequest),
    GameCategoryController.categoryQuestionCount
)

router.get(
    '/category-questions-deatils/:id',
    RequestParamsValidator(IdQueryRequest),
    GameCategoryController.categoryQuestionDetails
)

export default router
