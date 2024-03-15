import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";

import { Prisma } from "@prisma/client";
import { ContactUsResponse } from "../../../../responses/ContactUsResponse";
import { pagination } from "../../../../../../utils/utils";

export class ContactUsController {

  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;
    const { sortBy, sortType } = req.body.validatedSortData;
    let { search, toDate, fromDate } = req.body.validatedQueryData;
    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.ContactUsWhereInput = {
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
            name: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            discription: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    if (sortBy !== undefined) {
      sort = {
        [sortBy]: sortType,
      };
    }

    try {
      let findManyQuery: Prisma.ContactUsFindManyArgs = {
        where: querySearch,
        orderBy: sort,
        skip: perPage * (page - 1),
        take: perPage,
      };

      const totalCount = await dbConnection.contactUs.count({
        where: querySearch,
      });

      console.log(totalCount, querySearch);

      const contactUsAll =
        totalCount > 0
          ? await dbConnection.contactUs.findMany(findManyQuery)
          : [];

      return res.status(200).json({
        status: true,
        data: ContactUsResponse(contactUsAll),
        pagination: pagination(totalCount, perPage, page),
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "sothing went wrong",
      });
    }
  }

}
