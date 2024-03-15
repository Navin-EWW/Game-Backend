import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { UserResponse } from "../../../../responses/UserResponse";
import { encryptPassword } from "../../../../../../utils/handlepasswords";
import { sendWithDefaultTemplateEmail } from "../../../../../mails/DefaultMail";
import { UserLoginService } from "../../../../../services/UserLoginService";
import { DeviceService } from "../../../../../services/DeviceService";
import { Status } from "@prisma/client";
import bcrypt from "bcryptjs";
export class AuthController {

  public static async init(req: Request, res: Response) {
    const { version, deviceType } = req.body.validatedParamsData

    const findAppSetting = await dbConnection.appSetting.findFirst({
      where: {
        deviceType: deviceType,
        version: version
      },
      select: {
        showLogin: true
      }
    })

    return res.json({
      status: true,
      data: findAppSetting,
      message: req.t("app.init"),
    });
  }

  public static async register(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      email,
      phoneCode,
      phoneNumber,
      countryId,
      dateOfBirth,
      password,
      confirm_password,
    } = req.body.validatedData;

    const findUser = await dbConnection.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return res.json({
        status: false,
        message: req.t("user.user_already_exists"),
      });
    }
    const findPhoneNumber = await dbConnection.user.findFirst({
      where: {
        phoneCode: phoneCode,
        phoneNumber: phoneNumber
      }
    })
    if (findPhoneNumber) {
      return res.json({
        status: false,
        message: req.t("user.user_phone_no_already_exists"),
      });
    }

    if (confirm_password != password) {
      return res.json({
        status: false,
        message: req.t("user.confirm_password_passoword_same"),
      });
    }

    const encryptedPassword = encryptPassword(password);

    const registerUser = await dbConnection.user.create({
      data: {
        firstName,
        lastName,
        email,
        dateOfBirth,
        countryId,
        phoneCode,
        phoneNumber,
        displayPhoneNumber: `${phoneCode}-${phoneNumber}`,
        password: encryptedPassword,
        deletedAt: null,
      },
    });

    if (email) {
      const title = "Welcome to Seen Jeem";
      const data = {
        title,
        body: `Hello User`,
        email: email,
      };

      await sendWithDefaultTemplateEmail(data);
    }
    return res.json({
      status: true,
      data: UserResponse(registerUser),
      message: req.t("user.user_created"),
    });
  }

  public static async login(req: Request, res: Response) {
    const { email, password, deviceType, fcmToken, metaData } =
      req.body.validatedData;
    const user = await UserLoginService.login(email, password);
    console.log(user);

    if (user?.status == Status.INACTIVE) {
      return res.status(400).json({
        status: false,
        message: req.t("user.account_inactive"),
      });
    }

    if (user === null) {
      return res.status(200).json({
        status: false,
        message: req.t("user.wrong_email_or_password"),
      });
    }
    console.log(user.id);
    const userType = "User";
    const device = await DeviceService.create(
      user.id,
      userType,
      deviceType,
      fcmToken ?? "",
      metaData ?? {}
    );
    // await dbConnection.user.update({
    //   where: { email: email },
    //   data: {
    //     accessToken: device.authToken,
    //   },
    // });
    return res.json({
      status: true,
      data: UserResponse(user),
      accessToken: device.authToken,
      message: req.t("user.logged_in"),
    });
  }

  public static async completeProfile(req: Request, res: Response) {
    const { firstName, lastName, email, phoneNumber, profilePic, phoneCode } =
      req.body.validatedData;

    const findUser = await dbConnection.user.findFirst({
      where: { email: email },
    });

    if (findUser) {
      return res.status(400).json({
        status: false,
        message: req.t("user.wrong_email_or_password"),
      });
    }

    const updateUser = await dbConnection.user.update({
      where: { email: email },
      data: {
        firstName,
        lastName,
        phoneNumber,
        phoneCode,
        profilePic,
        displayPhoneNumber: `${phoneNumber}-${phoneCode}`,
        // isProfileCompleted: true,
      },
    });

    return res.json({
      status: true,
      data: UserResponse(updateUser),
      message: req.t("user.complete_profile"),
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
      data: UserResponse(user),
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

  public static async changePassword(req: Request, res: Response) {
    const { user } = req.body.auth;
    const { current_password, password, confirm_password } =
      req.body.validatedData;

    const finduser = await dbConnection.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!finduser) {
      return res.status(400).json({
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
        const user = await dbConnection.user.update({
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

  public static async updateProfile(req: Request, res: Response) {
    const { user } = req.body.auth;
    const { firstName, lastName, profilePic, dateOfBirth } =
      req.body.validatedData;

    const userData = await dbConnection.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        dateOfBirth,
        profilePic
      },
    });

    if (!userData) {
      return res.json({
        status: false,
        message: req.t("user.user_not_exists"),
      });
    }

    return res.status(200).send({
      status: true,
      data: UserResponse(userData),
      message: req.t("user.profile_update"),
    });
  }
}
