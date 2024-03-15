import { Router } from "express";

import { RequestParamsValidator, RequestQueryValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { PolicyPageUpdateRequest } from "../../../app/http/requests/PolicyPageUpdateRequest";
import { PolicyPageController } from "../../../app/http/controllers/api/SuperAdmin/PolicyPage/PolicyPageController";
import { PolicyPageTypeQueryRequest } from "../../../app/http/requests/PolicyPageTypeQueryRequest";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";


const router = Router();

router.get(
    "/:type",
    RequestParamsValidator(PolicyPageTypeQueryRequest),
    PolicyPageController.pageDetails);

router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(PolicyPageUpdateRequest),
    PolicyPageController.update);

export default router
