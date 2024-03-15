import { Router } from "express";
import { UPLOAD_TYPES } from "../../utils/types";
import { UploadSingleFile } from "../../app/http/middleware/Storage";
import { UploadController } from "../../app/http/controllers/api/Upload/UploadContrroller";


const router = Router();

router.post(
    "/",
    UploadSingleFile(UPLOAD_TYPES.IMAGE_AUDIO_VIDEO, "Image"),
    UploadController.uploadData
);

export default router