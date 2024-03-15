import { Request, Response } from "express";
import { DeviceService } from "../../../../../services/DeviceService";
import { LoginService } from "../../../../../services/LoginService";
import bcrypt from 'bcryptjs'
import dbConnection from "../../../../../providers/db";
import { AdminResponse } from "../../../../responses/AdminResponse";

export class AuthController {
  public static async login(req: Request, res: Response) {
    const { email, password, deviceType, fcmToken, metaData } =
      req.body.validatedData;
    const user = await LoginService.login(email, password);

    if (user === null) {
      return res.status(400).json({
        status: false,
        message: req.t("user.wrong_email_or_password"),
      });
    }
    console.log(user.id);
    const userType = "Admin";

    const device = await DeviceService.create(
      user.id,
      userType,
      deviceType,
      fcmToken ?? null,
      metaData ?? {}
    );

    return res.json({
      status: true,
      data: AdminResponse(user),
      accessToken: device.authToken,
      message: req.t("user.logged_in"),
    });
  }

  public static async profile(req: Request, res: Response) {
    const { user } = req.body.auth;
    if (user === null) {
      return res.status(401).json({
        status: false,
        message: req.t("user.user_not_found"),
      });
    }

    return res.json({
      status: true,
      data: AdminResponse(user),
    });
  }

  public static async logOut(req: Request, res: Response) {
    const { device, user } = req.body.auth;
    DeviceService.delete(device.id, user.id);

    return res.json({
      status: true,
      message: req.t("user.logged_out"),
    });
  }

  public static async profileEdit(req: Request, res: Response) {
    const { user } = req.body.auth;
    const { firstName, lastName, email, profilePic } = req.body.validatedData;
    if (user === null) {
      return res.status(401).json({
        status: false,
        message: req.t("user.user_not_found"),
      });
    }

    const userEdit = await dbConnection.admin.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        email,
        profilePic,
      },
    });

    return res.json({
      status: true,
      data: AdminResponse(userEdit),
      message: req.t("user.profile_update"),
    });
  }

  public static async changePassword(req: Request, res: Response) {
    const { user } = req.body.auth;
    const { current_password, password, confirm_password } =
      req.body.validatedData;

    const finduser = await dbConnection.admin.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!finduser) {
      return res.json({
        status: false,
        message: req.t("user.user_not_exists"),
      });
    } else {
      //confirm and password same
      if (confirm_password != password) {
        return res.json({
          status: false,
          message: req.t("user.confirm_password_passoword_same"),
        });
      }

      //od password and password same
      if (current_password === password) {
        return res.json({
          status: false,
          message: req.t("user.same_password"),
        });
      }


      //if valid
      const isValid = bcrypt.compareSync(current_password, finduser.password);

      if (isValid) {
        const user = await dbConnection.admin.update({
          where: { id: finduser.id },
          data: { password: await bcrypt.hashSync(password) },
        });
        if (user) {
          return res.status(200).send({
            status: true,
            message: req.t("user.password_reset_successs"),
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: req.t("user.user_wrong_password"),
        });
      }
    }

    return res.json({
      status: true,
      message: req.t("user.logged_out"),
    });
  }
}

