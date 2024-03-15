import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { SponsorResponse } from "../../../../responses/SponsorResponse";


export class SponsorController {

    public static async index(req: Request, res: Response) {
        const sponser = await dbConnection.sponsor.findMany()


        if (!sponser) {
            return res.status(400).json({
                status: false,
                message: req.t("crud.not_found", { model: 'Sponsor' }),
            });
        }

        return res.send({
            status: true,
            data: SponsorResponse(sponser)
        });
    }

}