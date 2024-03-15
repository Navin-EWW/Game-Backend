import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../app/http/middleware/RequestValidator";
import {
  BlogFilterRequest,
  BlogsRequest,
  BlogsStatusRequest,
  UpdateBlogsRequest,
  ViewBlogsRequest,
} from "../../../app/http/requests/BlogsRequest";
import { BlogsController } from "../../../app/http/controllers/api/SuperAdmin/Blogs/BlogsController";
import { IdQueryRequest } from "../../../app/http/requests/IdQueryRequest";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";

const router = Router();

router.get(
  "/",
  paginationCleaner,
  RequestQueryValidator(BlogFilterRequest),
  RequestSortValidator(["id", "title", "slug", "createdAt"]),
  BlogsController.index
);

router.post("/", RequestValidator(BlogsRequest), BlogsController.add);

router.put(
  "/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(UpdateBlogsRequest),
  BlogsController.update
);

router.put(
  "/delete/:id",
  RequestParamsValidator(IdQueryRequest),
  BlogsController.delete
);

router.put(
  "/status/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestValidator(BlogsStatusRequest),
  BlogsController.status
);

router.get(
  "/:slug",
  RequestParamsValidator(ViewBlogsRequest),
  BlogsController.view
);

export default router;
