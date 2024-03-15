import { Request, Router, Response } from "express";
//ROUTES IMPORT
import authRouter from "./auth";
import BlogsRouter from "./blogs";
import UsersRouter from "./users";
import policyPageRouter from "./policyPages";
import DashboardRouter from "./dashboard";
import gameCategoryRouter from "./gameCategory";
import gameQuestionRouter from "./gameQuestion";
import promoCodeRouter from "./promocode";
import specialGameQuestionRouter from "./specialGameQuestion";
import gamePackagesRouter from "./gamePackages";
import specialGameCategoryRouter from "./specialGameCategory";
import sponsorRouter from "./sponsor";
import contactUsRouter from "./contactus"
import appSettingRouter from './appSetting'
const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", BlogsRouter);
router.use("/users", UsersRouter);
router.use("/dashboard", DashboardRouter);
router.use("/policy-page", policyPageRouter);
router.use("/game-category", gameCategoryRouter);
router.use("/game-question", gameQuestionRouter);
router.use("/special-game-category", specialGameCategoryRouter);
router.use("/special-game-question", specialGameQuestionRouter);
router.use("/promo-code", promoCodeRouter);
router.use("/promo-code", promoCodeRouter);
router.use("/sponsor", sponsorRouter);
router.use("/game-packages", gamePackagesRouter);
router.use("/contact-us", contactUsRouter);
router.use('/app-setting', appSettingRouter)
export default router;
