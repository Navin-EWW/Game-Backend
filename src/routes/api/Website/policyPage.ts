import { Router } from "express";
import { PolicyPageTypeQueryRequest } from "../../../app/http/requests/PolicyPageTypeQueryRequest";
import { RequestParamsValidator } from "../../../app/http/middleware/RequestValidator";
import { PolicyPageController } from "../../../app/http/controllers/api/Website/PolicyPages/PolicyPagesController";


const router = Router();

router.get(
    "/:type",
    RequestParamsValidator(PolicyPageTypeQueryRequest),
    PolicyPageController.pageDetails
);

export default router;