import { Router } from "express";
import { ContactUsController } from "../../../app/http/controllers/api/Website/ContactUs/ContactUsController";
import { paginationCleaner } from "../../../app/http/middleware/Pagination";
import { RequestQueryValidator, RequestSortValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { ContactUsFilterRequest, ContactUsRequest } from "../../../app/http/requests/ContactUsRequest";


const router = Router();

router.get(
    "/",
    paginationCleaner,
    RequestQueryValidator(ContactUsFilterRequest),
    RequestSortValidator(["id", "name", "discription","email", "createdAt"]),
    ContactUsController.index
);



export default router;