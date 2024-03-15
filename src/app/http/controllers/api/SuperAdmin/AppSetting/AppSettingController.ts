import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";

export class AppSettingController {
    public static async index(req: Request, res: Response) {

        const apps = await dbConnection.appSetting.findMany()
        if (apps) {
            return res.json({
                status: true,
                data: apps,
                message: req.t("crud.list", { model: "App Settings" }),
            });
        }
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.body.validatedParamsData
        const { version, showLogin } = req.body.validatedData
        const app = await dbConnection.appSetting.update(
            {
                where: { id: id },
                data: {
                    version: version,
                    showLogin: showLogin,
                }
            },

        )
        if (app) {
            return res.json({
                status: true,
                data: app,
                message: req.t("crud.updated", { model: "App Settings" }),
            });
        }
    }
}