import { Router } from "express";
import { AuthController } from "../../../app/http/controllers/api/SuperAdmin/Auth/AuthController";
import { RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { LoginRequest } from "../../../app/http/requests/LoginRequest";
import { verifyResetToken, verifyToken } from "../../../app/http/middleware/Auth";
import { ForgotPasswordController } from "../../../app/http/controllers/api/SuperAdmin/Auth/ForgotPasswordController";
import { ForgotPasswordRequest } from "../../../app/http/requests/ForgotPasswordRequest";
import { ResetPasswordRequest } from "../../../app/http/requests/ResetPasswordRequest";
import { ProfileUpdateRequest } from "../../../app/http/requests/ProfileUpdateRequest";
import { changePasswordRequest } from "../../../app/http/requests/UserRequest";

const router = Router();

router.post("/login", RequestValidator(LoginRequest), AuthController.login);

router.get("/profile", verifyToken, AuthController.profile);

router.post(
  "/forgot-password",
  RequestValidator(ForgotPasswordRequest),
  ForgotPasswordController.forgot
);

router.post(
  "/reset-password",
  RequestValidator(ResetPasswordRequest),
  verifyResetToken,
  ForgotPasswordController.resetPassword
);

router.get("/logout", verifyToken, AuthController.logOut);


router.put("/edit-profile", verifyToken, RequestValidator(ProfileUpdateRequest), AuthController.profileEdit);




router.post(
  "/change-password",
  verifyToken,
  RequestValidator(changePasswordRequest),
  AuthController.changePassword)
export default router;
