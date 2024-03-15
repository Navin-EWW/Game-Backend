import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { pagination } from "../../../../../../utils/utils";
import { Class, Prisma } from "@prisma/client";
import { SpecialGamesCategoryResponse } from "../../../../responses/SpecialGameCategoryResponse";

export class SpecialGameCategoryController {
  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;
    const { sortBy, sortType } = req.body.validatedSortData;
    let { search, toDate, fromDate, status } = req.body.validatedQueryData;
    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.SpecialGamesCategoryWhereInput = {
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
            name: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            description: {
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
    let findManyQuery: Prisma.SpecialGamesCategoryFindManyArgs = {
      where: querySearch,
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
    };

    const totalCount = await dbConnection.specialGamesCategory.count({
      where: querySearch,
    });
    const categoires =
      totalCount > 0
        ? await dbConnection.specialGamesCategory.findMany(findManyQuery)
        : [];

    return res.json({
      status: true,
      data: SpecialGamesCategoryResponse(categoires),
      pagination: pagination(totalCount, perPage, page),
    });
  }
  public static async addCategory(req: Request, res: Response) {
    const { name, description, coverImage, amount } = req.body.validatedData;
    const Findcategory = await dbConnection.specialGamesCategory.findFirst({
      where: {
        name: name,
      },
    });

    if (Findcategory) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.already_exists", { model: "Special Game Category" }),
      });
    }

    const category = await dbConnection.specialGamesCategory.create({
      data: {
        name,
        description,
        coverImage,
        amount,
        deletedAt: null,
      },
    });
    if (category) {
      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(category),
        message: req.t("crud.created", { model: "Special Game Category" }),
      });
    }
  }

  public static async updateCategory(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { name, description, coverImage, amount } = req.body.validatedData;
    const Findcategory = await dbConnection.specialGamesCategory.findFirst({
      where: {
        id: id,
      },
    });

    if (!Findcategory) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Category" }),
      });
    }

    const category = await dbConnection.specialGamesCategory.update({
      where: { id: id },
      data: {
        name,
        description,
        coverImage,
        amount,
      },
    });
    if (category) {
      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(category),
        message: req.t("crud.updated", { model: "Special Game Category" }),
      });
    }
  }

  public static async deleteCategory(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const Findcategory = await dbConnection.specialGamesCategory.findFirst({
      where: {
        id: id,
      },
    });

    if (!Findcategory) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Category" }),
      });
    }

    const category = await dbConnection.specialGamesCategory.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
    if (category) {
      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(category),
        message: req.t("crud.deleted", { model: "Special Game Category" }),
      });
    }
  }

  public static async statusChange(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const statusUpdateCheck = await dbConnection.specialGamesCategory.findFirst(
      {
        where: { id: id },
      }
    );

    if (!statusUpdateCheck) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Category" }),
      });
    }

    const statusUpdate = await dbConnection.specialGamesCategory.update({
      where: { id: id },
      data: {
        status: status,
      },
    });

    return res.json({
      status: true,
      data: SpecialGamesCategoryResponse(statusUpdate),
      message: req.t("crud.updated", { model: "Special Game Category" }),
    });
  }

  public static async categoryQuestionCount(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData

    const gamesCategory = await dbConnection.specialGamesCategory.findFirst(
      {
        where: { id: id },
        include: {
          SpecialGamesQuestion: true
        }
      }
    );

    return res.json({
      status: true,
      data: gamesCategory,
      message: req.t('crud.list', { model: 'Speical Game Category Quesion count' }),
    });
  }
  public static async categoryQuestionDetails(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData

    const questions = await dbConnection.specialGamesQuestion.findMany({
      where: { categoryId: id }
    });
    console.log("questions", questions);

    let counts = {
      totalQuestions: questions.length,
      class_200: 0,
      class_400: 0,
      class_600: 0
    };
    if (questions) {
      for (const question of questions) {
        if (question.class === Class.CLASS_200) {
          counts.class_200++;
        } else if (question.class === Class.CLASS_400) {
          counts.class_400++;
        } else if (question.class === Class.CLASS_600) {
          counts.class_600++;
        }
      }
    }

    return res.json({
      status: true,
      data: counts,
      message: req.t('crud.list', { model: 'Special Game Category Question Report' })
    });
  }
}
