import { Request, Response } from "express";
import { DeviceService } from "../../../../../services/DeviceService";
import dbConnection from "../../../../../providers/db";
import { PolicyPageResponse } from "../../../../responses/PolicyPageResponse";
import { PolicyPage } from "@prisma/client";

export class PolicyPageController {

    public static async pageDetails(req: Request, res: Response) {
        const { type } = req.body.validatedParamsData
        const page = await dbConnection.policyPage.findFirst({
            where: { type: type },
        })

        if (!page) {
            return res.status(400).json({
                status: false,
                message: req.t("crud.not_found", { model: `${type} page` }),
            });
        }
        return res.send({
            status: true,
            data: PolicyPageResponse(page)
        });
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.body.validatedParamsData
        const { title, description } = req.body.validatedData;
        const page = await dbConnection.policyPage.update({
            where: { id: id },
            data: {
                title,
                description
            }
        })

        return res.send({
            status: true,
            data: PolicyPageResponse(page)
        });
    }
}