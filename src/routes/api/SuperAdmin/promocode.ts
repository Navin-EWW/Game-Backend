import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { PromoCodeController } from "../../../app/http/controllers/api/SuperAdmin/PromoCode/PromoCodeController";
import {
  PromoCodeFilterRequest,
  PromoCodeRequest,
  UpdatePromoCodeRequest,
} from "../../../app/http/requests/PromoCodeRequest";

const router = Router();

router.get("/users-list", PromoCodeController.userList);

router.get(
  "/",
  paginationCleaner,
  RequestQueryValidator(PromoCodeFilterRequest),
  RequestSortValidator([
    "id",
    "promoCode",
    "discount",
    "createdAt",
    "validTill",
    "validFrom",
  ]),
  PromoCodeController.index
);

router.post("/", RequestValidator(PromoCodeRequest), PromoCodeController.add);

router.put(
  "/update/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(UpdatePromoCodeRequest),
  PromoCodeController.update
);

router.put(
  "/delete/:id",
  RequestParamsValidator(IdQueryRequest),
  PromoCodeController.delete
);

router.get(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  PromoCodeController.view
);

export default router;
