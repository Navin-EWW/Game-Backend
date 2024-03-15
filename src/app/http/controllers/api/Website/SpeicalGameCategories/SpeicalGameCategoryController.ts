import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { SpecialGamesCategoryResponse } from "../../../../responses/SpecialGameCategoryResponse";
import { Prisma, Status } from "@prisma/client";

export class SpecialGameCategoryController {
  public static async list(req: Request, res: Response) {
    let { search } = req.body.validatedQueryData;
    console.log(search)
    try {
      let querySearch: Prisma.SpecialGamesCategoryWhereInput = {
        deletedAt: null || undefined,
        status: Status.ACTIVE,
      };

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

      const findCategories = await dbConnection.specialGamesCategory.findMany({
        where: querySearch,
      });
      
      // const findCategories = await dbConnection.specialGamesCategory.findMany({
      //   where: { deletedAt: null || undefined, status: Status.ACTIVE },
      // });

      //const transformedCategory = findCategories.map(GamesCategoryResponse);

      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(findCategories),
        message: req.t("crud.details", { model: "Speical Game Category" }),
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
