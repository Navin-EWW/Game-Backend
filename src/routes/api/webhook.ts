import { Router } from "express";

import { WebhookController } from "../../app/http/controllers/api/webhook/webhook";
import { RequestParamsValidator } from "../../app/http/middleware/RequestValidator";
import { IdQueryRequest } from "../../app/http/requests/IdQueryRequest";

const router = Router();

router.post(
  "/game-package/:id",
  RequestParamsValidator(IdQueryRequest),
  WebhookController.gamePackageWebhook
);


export default router;