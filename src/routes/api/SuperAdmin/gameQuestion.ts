import { Router } from "express";
import { RequestParamsValidator, RequestQueryValidator, RequestSortValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { StatusUpdateRequest } from "../../../app/http/requests/StatusUpdateRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { GameQuestionAddRequest, GameQuestionDeleteRequest } from "../../../app/http/requests/GameQuestionAddRequest";
import { GameQuestionController } from "../../../app/http/controllers/api/SuperAdmin/GameQuestion/GameQuestionController";
import { GameQuestionFilterRequest } from "../../../app/http/requests/GameQuestionFilterRequest";
import { GameQuestionUpdateRequest } from "../../../app/http/requests/GameQuestionUpdateRequest";


const router = Router();

router.get(
    "/",
    paginationCleaner,
    RequestQueryValidator(GameQuestionFilterRequest),
    RequestSortValidator(["id", "question", "category", , "createdAt"]),
    GameQuestionController.index
);

router.post(
    "/",
    RequestValidator(GameQuestionAddRequest),
    GameQuestionController.addQuestion
)

router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(GameQuestionUpdateRequest),
    GameQuestionController.updateQuestion
)

router.delete(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    GameQuestionController.deleteQuestion
)

router.delete(
    "/delete/question",
    RequestValidator(GameQuestionDeleteRequest),
    GameQuestionController.deleteManyQuestion
)

router.put(
    "/status/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(StatusUpdateRequest),
    GameQuestionController.statusChange
)

router.get(
    "/game-category",
    GameQuestionController.categoryList
)

router.get(
    "/class",
    GameQuestionController.classList
)

// router.get(
//     "/question-type",
//     GameQuestionController.QuestionTypeList
// )

router.post(
    "/question-duplicate/:id",
    RequestParamsValidator(IdQueryRequest),
    GameQuestionController.QuestionDuplicate
)
export default router