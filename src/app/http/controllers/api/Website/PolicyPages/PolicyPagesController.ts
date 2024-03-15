import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { PolicyPageResponse } from "../../../../responses/PolicyPageResponse";

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
}
