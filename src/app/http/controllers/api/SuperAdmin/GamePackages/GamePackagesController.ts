import { Request, Response } from "express";

import { gamePackagesResponse } from "../../../../responses/GamePackagesResponse";
import dbConnection from "../../../../../providers/db";
import { Prisma, Status } from "@prisma/client";
import { pagination } from "../../../../../../utils/utils";

export class GamePackagesController {
  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;
    const { sortBy, sortType } = req.body.validatedSortData;
    let { search, toDate, fromDate, status } = req.body.validatedQueryData;
    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.GamePackagesWhereInput = {
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
    if (status) {
      querySearch = {
        ...querySearch,
        status: status,
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
            title: {
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
        ],
      };
    }

    if (sortBy !== undefined) {
      sort = {
        [sortBy]: sortType,
      };
    }

    try {
      let findManyQuery: Prisma.GamePackagesFindManyArgs = {
        where: querySearch,
        orderBy: sort,
        skip: perPage * (page - 1),
        take: perPage,
      };

      // const totalCount = await dbConnection.gamePackages.count();
      const totalCount = await dbConnection.gamePackages.count({
        where: querySearch,
      });

      console.log(totalCount, querySearch);

      const gamePackagesall =
        totalCount > 0 ? await dbConnection.gamePackages.findMany(findManyQuery) : [];

      return res.status(200).json({
        status: true,
        data: gamePackagesResponse(gamePackagesall),
        pagination: pagination(totalCount, perPage, page),
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "sothing went wrong",
      });
    }
  }
  public static async addGamePackages(req: Request, res: Response) {
    const validatedData = req.body;
    const { title, discount, status, totalGame, price, discription, image, discountedPrice } =
      validatedData;
    try {
      const gamePackages = await dbConnection.gamePackages.create({
        data: {
          title,
          discount,
          status: Status.ACTIVE,
          totalGame,
          price,
          discription,
          image,
          discountedPrice,
          deletedAt: null,

        },
      });

      if (!gamePackages) {
        return res.status(400).json({
          status: false,
          message: req.t("crud.already_exists", { model: "Game Packages" }),
        });
      }

      return res.status(200).send({
        status: true,
        data: gamePackages ?? gamePackagesResponse(gamePackages),
        message: req.t("crud.created", { model: "Game Packages" }),

      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "sothing went wrong",
      });
    }
  }
  public static async updateGamePackages(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { title, discount, totalGame, price, discription, image, discountedPrice } =
      req.body.validatedData;

    const FindgamePackages = await dbConnection.gamePackages.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindgamePackages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Packages" }),
      });
    }
    const gamePackagesUpdate = await dbConnection.gamePackages.update({
      where: { id: id },
      data: {
        title: title ? title : FindgamePackages.title,
        discount: discount ? discount : FindgamePackages.discount,
        discription: discription ? discription : FindgamePackages.discription,
        image: image ? image : FindgamePackages.image,
        price: price ? price : FindgamePackages.price,
        totalGame: totalGame ? totalGame : FindgamePackages.totalGame,
        discountedPrice: discountedPrice
      },
    });

    if (gamePackagesUpdate) {
      return res.json({
        status: true,
        data: gamePackagesResponse(gamePackagesUpdate),
        message: req.t("crud.updated", { model: "Game Packages" }),
      });
    }
  }
  public static async findGamePackagesById(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const FindgamePackages = await dbConnection.gamePackages.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindgamePackages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Packages" }),
      });
    }

    if (FindgamePackages) {
      return res.json({
        status: true,
        data: gamePackagesResponse(FindgamePackages),
        message: req.t("crud.details", { model: "Game Packages" }),
      });
    }
  }
  public static async updateStatusGamePackages(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const FindgamePackages = await dbConnection.gamePackages.findFirst({
      where: {
        id: id,
        deletedAt: undefined,
      },
    });

    if (!FindgamePackages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Packages" }),
      });
    }
    const gamePackagesUpdate = await dbConnection.gamePackages.update({
      where: { id: id },
      data: {
        status: status,
      },
    });

    if (gamePackagesUpdate) {
      return res.json({
        status: true,
        data: gamePackagesResponse(gamePackagesUpdate),
        message: req.t("crud.status", { model: "Game Packages" }),
      });
    }
  }
  public static async deleteGamePackagesById(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const deletegamePackages = await dbConnection.gamePackages.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!deletegamePackages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Packages" }),
      });
    }
    if (deletegamePackages) {
      return res.json({
        status: true,
        data: gamePackagesResponse(deletegamePackages),
        message: req.t("crud.deleted", { model: "Game Packages" }),
      });
    }
  }
}
