import { Request, Router, Response } from "express";
import { PingController } from "../../app/http/controllers/api/PingController";
import adminRouter from "./SuperAdmin/api";
import userRouter from "./Website/api";
import uploadRouter from "./upload";
import countryStateCityRouter from "./countryStateCity";
import webhookController from "./webhook";
//ROUTES IMPORT

const router = Router();

router.get("/", PingController.pong);

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/upload", uploadRouter);
router.use("/country-state-city", countryStateCityRouter);
router.use("/webhook", webhookController);

/**
 * 404 api redirects
 */
// router.use(function (req: Request, res: Response) {
//   res.status(404).send({
//     status: false,
//     message: "Not found",
//   });
// });

export default router;
