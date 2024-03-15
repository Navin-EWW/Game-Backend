import { Router } from "express";
import { RequestParamsValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { AuthController } from "../../../app/http/controllers/api/Website/Auth/AuthController";
import {
  RegisterUser,
  UpdateUsersRequest,
  changePasswordRequest,
  completeProfileRequest,
  updateProfileRequest,
} from "../../../app/http/requests/UserRequest";
import { LoginRequest } from "../../../app/http/requests/LoginRequest";
import { ForgotPasswordRequest } from "../../../app/http/requests/ForgotPasswordRequest";
import { ForgotPasswordController } from "../../../app/http/controllers/api/Website/Auth/ForgotPasswordController";
import { ResetPasswordRequest } from "../../../app/http/requests/ResetPasswordRequest";
import { userVerifyToken, verifyResetToken } from "../../../app/http/middleware/Auth";
import { AppInitParamsRequest } from "../../../app/http/requests/AppInitParamsRequest";

const router = Router();

router.get(
  "/init/:version/:deviceType",
  RequestParamsValidator(AppInitParamsRequest),
  AuthController.init
)

router.post(
  "/register",
  RequestValidator(RegisterUser),
  AuthController.register
);

router.post("/login", RequestValidator(LoginRequest), AuthController.login);

router.post(
  "/complete-profile",
  RequestValidator(completeProfileRequest),
  AuthController.completeProfile
);


router.post(
  "/forgot-password",
  RequestValidator(ForgotPasswordRequest),
  ForgotPasswordController.forgot
);

router.get(
  "/reset-password",
  verifyResetToken,
  ForgotPasswordController.checkResetToken
);

router.post(
  "/reset-password",
  RequestValidator(ResetPasswordRequest),
  verifyResetToken,
  ForgotPasswordController.resetPassword
);

router.get(
  "/profile",
  userVerifyToken,
  AuthController.profile
)

router.get("/logout", userVerifyToken, AuthController.logOut);

router.post(
  "/change-password",
  userVerifyToken,
  RequestValidator(changePasswordRequest),
  AuthController.changePassword)


  router.post(
    "/update-profile",
    userVerifyToken,
    RequestValidator(updateProfileRequest),
    AuthController.updateProfile)

export default router;
