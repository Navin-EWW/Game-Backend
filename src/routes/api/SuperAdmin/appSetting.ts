import { Router } from "express";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { RequestParamsValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { AppSettingController } from "../../../app/http/controllers/api/SuperAdmin/AppSetting/AppSettingController";
import { AppSettingUpdateRequest } from "../../../app/http/requests/AppSettingUpdateRequest";


const router = Router();

router.get(
    '/',
    AppSettingController.index
)

router.put(
    "/:id",
    RequestParamsValidator(IdQueryRequest),
    RequestValidator(AppSettingUpdateRequest),
    AppSettingController.update
)

export default router;