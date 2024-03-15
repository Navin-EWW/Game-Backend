import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { GamesCategoryResponseWeb } from "../../../../responses/GameCategoryResponseWeb";
import { Status } from "@prisma/client";

export class CategoryController {
  public static async list(req: Request, res: Response) {
    try {
      const findCategories: any = await dbConnection.gamesCategory.findMany({
        where: { deletedAt: null, status: Status.ACTIVE },
      });

      const category: any = await dbConnection.gamesQuestion.aggregateRaw({
        pipeline: [
          { $group: { _id: "$categoryId" } },
          {
            $lookup: {
              from: "games_categories",
              localField: "_id",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: {
              path: "$category",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              "category.deletedAt": null,
            },
          },
          { $project: { _id: 0, category: 1 } },
        ],
      });

      return res.json({
        status: true,
        data: GamesCategoryResponseWeb(category),
        message: req.t("crud.details", { model: "Game Category" }),
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
