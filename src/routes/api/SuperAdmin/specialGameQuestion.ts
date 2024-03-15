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
import { SpecialGameQuestionController } from "../../../app/http/controllers/api/SuperAdmin/SpecialGameQuestion/SpecialGameQuestionController";
import { SpecialGameQuestionFilterRequest } from "../../../app/http/requests/SpecialGameQuestionFilterRequest";
import { SpecialGameQuestionAddRequest } from "../../../app/http/requests/SpecialGameQuestionAddRequest";
import { SpecialGameQuestionUpdateRequest } from "../../../app/http/requests/SpecialGameQuestionUpdateRequest";
import { GameQuestionDeleteRequest } from "../../../app/http/requests/GameQuestionAddRequest";

const router = Router();

router.get(
  "/",
  paginationCleaner,
  RequestQueryValidator(SpecialGameQuestionFilterRequest),
  RequestSortValidator(["id", "question", "SpecialGamesCategory", "createdAt"]),
  SpecialGameQuestionController.index
);

router.post(
  "/",
  RequestValidator(SpecialGameQuestionAddRequest),
  SpecialGameQuestionController.addQuestion
);

router.put(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(SpecialGameQuestionUpdateRequest),
  SpecialGameQuestionController.updateQuestion
);

router.delete(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  SpecialGameQuestionController.deleteQuestion
);

router.put(
  "/status/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(StatusUpdateRequest),
  SpecialGameQuestionController.statusChange
);

router.delete(
  "/delete/question",
  RequestValidator(GameQuestionDeleteRequest),
  SpecialGameQuestionController.deleteManyQuestion
)

router.get("/game-category", SpecialGameQuestionController.specialCategoryList);

router.get("/class", SpecialGameQuestionController.classList);

router.post(
  "/question-duplicate/:id",
  RequestParamsValidator(IdQueryRequest),
  SpecialGameQuestionController.QuestionDuplicate
)
export default router;
