import { Router } from "express";
import { SpecialGameCategoryController } from "../../../app/http/controllers/api/Website/SpeicalGameCategories/SpeicalGameCategoryController";
import { RequestQueryValidator } from "../../../app/http/middleware/RequestValidator";
import { SpecialGameCategoryFilterRequest } from "../../../app/http/requests/SpecialGameCategoryFilterRequest";

const router = Router();

router.get(
  "/list",
  RequestQueryValidator(SpecialGameCategoryFilterRequest),
  SpecialGameCategoryController.list
);

export default router;
