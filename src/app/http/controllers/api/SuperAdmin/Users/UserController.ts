import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { UserResponse } from "../../../../responses/UserResponse";
import { pagination } from "../../../../../../utils/utils";
import { GamePackagePaymentHistory, GamePackages, Prisma, Status } from "@prisma/client";
import { GamesHistoryResponse } from "../../../../responses/GameHistoryResponse";
import { GamePackagesResponseAdmin } from "../../../../responses/GamePackageResponseAdmin";
import { SpecialGamesHistoryResponse } from "../../../../responses/SpecialGamesHistoryResponse";

export class UserController {
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

    let querySearch: Prisma.UserWhereInput = {
      deletedAt: null,
    };
    if (status && status !== undefined) {
      querySearch = {
        ...querySearch,
        status: status,
      };
    }
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
            firstName: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            displayPhoneNumber: {
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

    if (toDate && fromDate && toDate != undefined && fromDate != undefined) {
      querySearch = {
        ...querySearch,
        createdAt: {
          gte: new Date(newfromDate),
          lte: new Date(newtoDate),
        },
      };
    }

    if (sortBy !== undefined) {
      sort = {
        [sortBy]: sortType,
      };
    }
    console.log("querySearch", querySearch);

    let findManyQuery: Prisma.UserFindManyArgs = {
      where: querySearch,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        displayPhoneNumber: true,
        profilePic: true,
        phoneNumber: true,
        phoneCode: true,
        createdAt: true,
      },
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
    };

    const totalCount = await dbConnection.user.count({
      where: querySearch,
    });
    const pages =
      totalCount > 0 ? await dbConnection.user.findMany(findManyQuery) : [];

    return res.json({
      status: true,
      data: pages,
      pagination: pagination(totalCount, perPage, page),
    });
  }

  public static async view(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findUser = await dbConnection.user.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findUser) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "User" }),
      });
    }

    return res.json({
      status: true,
      data: UserResponse(findUser),
      message: req.t("crud.details", { model: "User" }),
    });
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findUser = await dbConnection.user.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findUser) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "User" }),
      });
    }

    const updateUser = await dbConnection.user.update({
      where: {
        id,
      },
      data: { deletedAt: new Date() },
    });

    if (updateUser.status === Status.INACTIVE) {
      const deleteUsers = await dbConnection.device.deleteMany({
        where: { userId: findUser.id }
      })
      console.log("deleteUsers=================", deleteUsers);

    }
    return res.json({
      status: true,
      data: UserResponse(updateUser),
      message: req.t("crud.deleted", { model: "User" }),
    });
  }
  public static async status(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const findUser = await dbConnection.user.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findUser) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "User" }),
      });
    }
    const updateStatus = await dbConnection.user.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    if (updateStatus.status === Status.INACTIVE) {
      const deleteUsers = await dbConnection.device.deleteMany({
        where: { userId: findUser.id }
      })
      console.log("deleteUsers=================", deleteUsers);
    }

    return res.json({
      status: true,
      data: UserResponse(updateStatus),
      message: req.t("crud.status", { model: "User" }),
    });
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { firstName, lastName, profilePic } = req.body.validatedData;

    const findUser = await dbConnection.user.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findUser) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "User" }),
      });
    }

    const updateUser = await dbConnection.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        profilePic,
      },
    });
    return res.json({
      status: true,
      data: UserResponse(updateUser),
      message: req.t("crud.updated", { model: "User" }),
    });
  }

  public static async gameHistory(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    console.log("===>", id);
    // const newID = new mongoose.Types.ObjectId(id)
    const findGames: any = await dbConnection.games.aggregateRaw({
      pipeline: [
        {
          '$match': {
            'userId': { '$oid': id }
          }
        }, {
          '$lookup': {
            'from': 'games_categories',
            'localField': 'categoriesId',
            'foreignField': '_id',
            'as': 'categoriesId'
          }
        },
        {
          '$sort': {
            'createdAt': -1
          }
        }
      ]
    });
    return res.json({
      status: true,
      data: GamesHistoryResponse(findGames),
      message: req.t('crud.list', { model: 'Game History' })
    });
  }

  public static async specialGameHistory(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findGames: any = await dbConnection.speicalGames.aggregateRaw({
      pipeline: [
        {
          '$match': {
            'userId': { '$oid': id }
          }
        }, {
          '$lookup': {
            'from': 'special_games_categories',
            'localField': 'categoryId',
            'foreignField': '_id',
            'as': 'categoryId'
          }
        },
        {
          '$sort': {
            'createdAt': -1
          }
        }
      ]
    });
    return res.json({
      status: true,
      data: SpecialGamesHistoryResponse(findGames),
      message: req.t('crud.list', { model: 'Game History' })
    });
  }

  public static async gamepackageCount(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findPackages = await dbConnection.gamePackagePaymentHistory.findMany({
      where: { userId: id },
      include: {
        Package: true
      }
    })

    let totalGamesCount = 0;

    findPackages.forEach((packageData: GamePackagePaymentHistory) => {
      totalGamesCount += parseInt(packageData.totalGame);
    });

    return res.json({
      status: true,
      data: { totalPackage: totalGamesCount },
      message: req.t('crud.list', { model: 'Game History' })
    });

  }

  public static async gamepackages(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findPackages: any = await dbConnection.gamePackagePaymentHistory.findMany({
      where: { userId: id },
    })



    return res.json({
      status: true,
      data: GamePackagesResponseAdmin(findPackages),
      message: req.t('crud.list', { model: 'Game Packages' })
    });

  }
}
