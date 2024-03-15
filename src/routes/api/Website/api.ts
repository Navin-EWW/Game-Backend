import { Router } from "express";

import userAuthRouter from "./auth";
import categoryRouter from "./gameCategory";
import policyPageRouter from "./policyPage";
import speicalCategoryRouter from './specialGameCategory';
import gameRouter from './game'
import contactUsRouter from './contactUs'
import gamePackageRouter from './package'
import sponsorRouter from './sponsor'
import paymentsRouter from './payment'
import specialGameRouter from './specialGame'
const router = Router();

router.use("/auth", userAuthRouter);
router.use("/game-category", categoryRouter);
router.use("/special-game-category", speicalCategoryRouter);
router.use("/policy-pages", policyPageRouter);
router.use("/game-packages", gamePackageRouter);
router.use("/sponsor", sponsorRouter);
router.use("/game", gameRouter);
router.use("/contact-us", contactUsRouter);
router.use("/payments", paymentsRouter);
router.use("/special-game", specialGameRouter);


export default router;
