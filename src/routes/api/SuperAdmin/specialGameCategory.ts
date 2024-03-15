import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { StatusUpdateRequest } from "../../../app/http/requests/StatusUpdateRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { SpecialGameCategoryFilterRequest } from "../../../app/http/requests/SpecialGameCategoryFilterRequest";
import { SpecialGameCategoryController } from "../../../app/http/controllers/api/SuperAdmin/SpecialGameCategory/SpecialGameCategoryController";
import { SpecialGameCategoryAddRequest } from "../../../app/http/requests/SpecialGameCategoryAddRequest";
import { SpecialGameCategoryUpdateRequest } from "../../../app/http/requests/SpecialGameCategoryUpdateRequest";

const router = Router();

router.get(
  "/",
  paginationCleaner,
  RequestQueryValidator(SpecialGameCategoryFilterRequest),
  RequestSortValidator(["id", "name", "description", "createdAt"]),
  SpecialGameCategoryController.index
);

router.post(
  "/",
  RequestValidator(SpecialGameCategoryAddRequest),
  SpecialGameCategoryController.addCategory
);

router.put(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(SpecialGameCategoryUpdateRequest),
  SpecialGameCategoryController.updateCategory
);

router.delete(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  SpecialGameCategoryController.deleteCategory
);

router.put(
  "/status/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(StatusUpdateRequest),
  SpecialGameCategoryController.statusChange
);

router.get(
  "/category-count/:id",
  RequestParamsValidator(IdQueryRequest),
  SpecialGameCategoryController.categoryQuestionCount
)


router.get(
  '/category-questions-deatils/:id',
  RequestParamsValidator(IdQueryRequest),
  SpecialGameCategoryController.categoryQuestionDetails
)

export default router;
