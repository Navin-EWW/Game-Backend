import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";

import { Prisma } from "@prisma/client";
import { ContactUsResponse } from "../../../../responses/ContactUsResponse";
import { pagination } from "../../../../../../utils/utils";

export class ContactUsController {

  public static async index(req: Request, res: Response) {
    console.log(req.body, "req.body")
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
  public static async addContactUs(req: Request, res: Response) {

    const { name, email, phoneNumber, discription } = req.body.validatedData;
    try {
      const contactUsRes = await dbConnection.contactUs.create({
        data: {
          name,
          email,
          phoneNumber,
          discription,
          deletedAt: null,
        },
      });
      // if (!contactUsRes) {
      //   return res.status(400).json({
      //     status: false,
      //     message: req.t("crud.already_exists", { model: "Contact Us" }),
      //   });
      // }

      return res.status(200).send({
        status: true,
        data: contactUsRes ? ContactUsResponse(contactUsRes) : contactUsRes,
        message: req.t("contactus.response"),
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "sothing went wrong",
      });
    }
  }
  public static async updateContactUs(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { name, email, phoneNumber, discription } = req.body.validatedData;

    const FindContactUs = await dbConnection.contactUs.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindContactUs) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Contact Us" }),
      });
    }
    const conatctUsUpdate = await dbConnection.contactUs.update({
      where: { id: id },
      data: {
        name: name ? name : FindContactUs.name,
        phoneNumber: phoneNumber ? phoneNumber : FindContactUs.phoneNumber,
        discription: discription ? discription : FindContactUs.discription,
        email: email ? email : FindContactUs.email,
      },
    });

    if (conatctUsUpdate) {
      return res.json({
        status: true,
        data: conatctUsUpdate
          ? ContactUsResponse(conatctUsUpdate)
          : conatctUsUpdate,
        message: req.t("crud.updated", { model: "Contact Us" }),
      });
    }
  }
  public static async findContactUsById(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const FindcontactUs = await dbConnection.contactUs.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindcontactUs) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Contact Us" }),
      });
    }

    if (FindcontactUs) {
      return res.json({
        status: true,
        data: ContactUsResponse(FindcontactUs),
        message: req.t("crud.details", { model: "Contact Us" }),
      });
    }
  }
  public static async deleteContactUsById(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const deletecontactUs = await dbConnection.contactUs.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!deletecontactUs) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Contact Us" }),
      });
    }
    if (deletecontactUs) {
      return res.json({
        status: true,
        data: ContactUsResponse(deletecontactUs),
        message: req.t("crud.deleted", { model: "Contact Us" }),
      });
    }
  }
}
