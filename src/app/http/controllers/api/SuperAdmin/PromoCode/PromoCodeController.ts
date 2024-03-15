import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { PromoCodeResponse } from "../../../../responses/PromoCodeResponse";
import { pagination } from "../../../../../../utils/utils";
import { Prisma } from "@prisma/client";
import { UserResponse } from "../../../../responses/UserResponse";

export class PromoCodeController {
  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;
    const { sortBy, sortType } = req.body.validatedSortData;
    let { toDate, fromDate, search, type, status } =
      req.body.validatedQueryData;
    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.PromoCodeWhereInput = {
      deletedAt: null,
    };

    if (type && type !== undefined) {
      querySearch = {
        ...querySearch,
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
            promoCode: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            discount: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            User: {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
    }

    if (toDate && fromDate && toDate != undefined && fromDate != undefined) {
      querySearch = {
        ...querySearch,
        OR: [
          {
            createdAt: {
              gte: new Date(newfromDate),
              lte: new Date(newtoDate),
            },
          },
          {
            validFrom: {
              gte: new Date(newfromDate),
              lte: new Date(newtoDate),
            },
          },
          {
            validTill: {
              gte: new Date(newfromDate),
              lte: new Date(newtoDate),
            },
          },
        ]
      };
    }

    if (sortBy !== undefined) {
      sort = {
        [sortBy]: sortType,
      };
    }

    let findManyQuery: Prisma.PromoCodeFindManyArgs = {
      where: querySearch,
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
    };

    const totalCount = await dbConnection.promoCode.count({
      where: querySearch,
    });
    const pages: any =
      totalCount > 0
        ? await dbConnection.promoCode.findMany(findManyQuery)
        : [];

    return res.json({
      status: true,
      data: PromoCodeResponse(pages),
      pagination: pagination(totalCount, perPage, page),
    });
  }

  public static async add(req: Request, res: Response) {
    const { promoCode, validFrom, validTill, userId, discount, discountType } =
      req.body.validatedData;

    const findCode = await dbConnection.promoCode.findFirst({
      where: {
        promoCode,
        deletedAt: undefined,
      },
    });

    if (findCode) {
      return res.json({
        status: false,
        message: req.t("crud.already_exists", { model: "Promo code" }),
      });
    }

    if (discountType == "PERCENTAGE" && discount == "100%") {
      return res.json({
        status: false,
        message: "You are not allowed to give 100% discount",
      });
    }

    let data: any = {
      promoCode,
      discount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      deletedAt: null,
      discountType: discountType,
    };

    if (userId) {
      data = {
        promoCode,
        discount,
        validFrom: new Date(validFrom),
        validTill: new Date(validTill),
        deletedAt: null,
        discountType: discountType,
        User: {
          connect: {
            id: userId ? userId : null,
          },
        },
      };
    }
    const addCode: any = await dbConnection.promoCode.create({
      data: {
        ...data,
      },
    });

    return res.json({
      status: true,
      data: PromoCodeResponse(addCode),
      message: req.t("crud.created", { model: "Promo code" }),
    });
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { validFrom, validTill, discount, discountType } =
      req.body.validatedData;

    const findBlog = await dbConnection.promoCode.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Promo code" }),
      });
    }

    const updateCode: any = await dbConnection.promoCode.update({
      where: {
        id,
      },
      data: {
        discount,
        validFrom: new Date(validFrom),
        validTill: new Date(validTill),
        discountType,
      },
    });
    return res.json({
      status: true,
      data: PromoCodeResponse(updateCode),
      message: req.t("crud.updated", { model: "Promo code" }),
    });
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findCode = await dbConnection.promoCode.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findCode) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Promo code" }),
      });
    }

    const updateCode: any = await dbConnection.promoCode.update({
      where: {
        id,
      },
      data: { deletedAt: new Date() },
    });
    return res.json({
      status: true,
      data: PromoCodeResponse(updateCode),
      message: req.t("crud.deleted", { model: "Promo code" }),
    });
  }

  public static async view(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findCode: any = await dbConnection.promoCode.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findCode) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Promo code" }),
      });
    }

    return res.json({
      status: true,
      data: PromoCodeResponse(findCode),
      message: req.t("crud.details", { model: "Promo code" }),
    });
  }
  public static async userList(req: Request, res: Response) {
    try {
      const findUsers: any = await dbConnection.user.findMany({
        where: { deletedAt: null },
      });

      const transformedUsers = findUsers.map(UserResponse);

      return res.json({
        status: true,
        data: transformedUsers,
        message: req.t("crud.details", { model: "User" }),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  }
}
