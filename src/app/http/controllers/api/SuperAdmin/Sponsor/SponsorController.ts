import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { SponsorResponse } from "../../../../responses/SponsorResponse";
import { Prisma } from "@prisma/client";
import { pagination } from "../../../../../../utils/utils";


export class SponsorController {

    public static async index(req: Request, res: Response) {
        const { page, perPage } = req.body.pagination;
        const { sortBy, sortType } = req.body.validatedSortData;
        let { search, toDate, fromDate } =
            req.body.validatedQueryData;
        const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
        const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
        let sort: any = {
            createdAt: "desc",
        };

        let querySearch: Prisma.SponsorWhereInput = {
            deletedAt: null,
        };

        if (toDate && fromDate && toDate != undefined && fromDate != undefined) {
            querySearch = {
                ...querySearch,
                createdAt: {
                    gte: new Date(newfromDate),
                    lte: new Date(newtoDate),
                },
            };
        }


        if (
            search &&
            search !== undefined &&
            typeof search === "string" &&
            search.length !== 0
        ) {
            querySearch = {
                ...querySearch,
                OR: [
                    {
                        url: {
                            contains: search,
                            mode: "insensitive", // Case-insensitive search
                        },
                    }
                ],
            };
        }

        if (sortBy !== undefined) {
            sort = {
                [sortBy]: sortType,
            };
        }
        let findManyQuery: Prisma.SponsorFindManyArgs = {
            where: querySearch,
            orderBy: sort,
            skip: perPage * (page - 1),
            take: perPage,
        };

        const totalCount = await dbConnection.sponsor.count({
            where: querySearch,
        });

        let sponsors: any =
            totalCount > 0
                ? await dbConnection.sponsor.findMany(findManyQuery)
                : [];

        return res.json({
            status: true,
            data: SponsorResponse(sponsors),
            pagination: pagination(totalCount, perPage, page),
        });
    }

    public static async update(req: Request, res: Response) {
        const { id } = req.body.validatedParamsData
        const { url, image } = req.body.validatedData;
        const sponsor = await dbConnection.sponsor.update({
            where: { id: id },
            data: {
                url,
                image
            }
        })
        return res.send({
            status: true,
            data: SponsorResponse(sponsor),
            message: req.t("crud.updated", { model: "Sponsor" }),
        });
    }
    public static async statusUpdate(req: Request, res: Response) {
        const { id } = req.body.validatedParamsData
        const { status } = req.body.validatedData;
        const sponsor = await dbConnection.sponsor.update({
            where: { id: id },
            data: {
                status: status,
              },
        })
        
        return res.send({
            status: true,
            data: SponsorResponse(sponsor),
            message: req.t("crud.updated", { model: "Sponsor" }),
        });
    }
}