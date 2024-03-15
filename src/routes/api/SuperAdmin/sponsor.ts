import { Router } from "express";

import { RequestParamsValidator, RequestQueryValidator, RequestSortValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { GameCategoryAddRequest } from "../../../app/http/requests/GameCategoryAddRequest";
import { GameCategoryController } from "../../../app/http/controllers/api/SuperAdmin/GameCategory/GameCategoryController";
import { GameCategoryUpdateRequest } from "../../../app/http/requests/GameCategoryUpdateRequest";
import { StatusUpdateRequest } from "../../../app/http/requests/StatusUpdateRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { GameCategoryFilterRequest } from "../../../app/http/requests/GameCategoryFilterRequest";
import { SponsorController } from "../../../app/http/controllers/api/SuperAdmin/Sponsor/SponsorController";
import { SponsorFilterRequest, SponsorUpdateRequest } from "../../../app/http/requests/SponsorRequest";


const router = Router();

router.get(
    "/",
    paginationCleaner,
    RequestQueryValidator(SponsorFilterRequest),
    RequestSortValidator(["id", "url", "createdAt"]),
    SponsorController.index
);


router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(SponsorUpdateRequest),
    SponsorController.update
)

router.put(
    "/status/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(StatusUpdateRequest),
    SponsorController.statusUpdate
)




export default router
