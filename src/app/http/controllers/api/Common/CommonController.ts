import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import dbConnection from "../../../../providers/db";

export class CountriesProvincesCitiesController {
  public static async countries(req: Request, res: Response) {
    let { name, ios2 } = req.body.validatedQueryData;
    let querySearch: Prisma.CountryWhereInput = {};

    if (
      name &&
      name !== undefined &&
      typeof name === "string" &&
      name.length !== 0
    ) {
      querySearch = {
        ...querySearch,
        name: {
          mode: "insensitive",
          contains: name,
        },
      };
    }

    if (
      ios2 &&
      ios2 !== undefined &&
      typeof ios2 === "string" &&
      ios2.length !== 0
    ) {
      querySearch = {
        ...querySearch,
        iso2: {
          mode: "insensitive",
          contains: ios2,
        },
      };
    }
    console.log("querySearch",querySearch);

    const countries = await dbConnection.country.findMany({
      // where: querySearch,
    });
    return res.send({
      status: true,
      data: countries,
      message: "countries details",
    });
  }

  public static async provinces(req: Request, res: Response) {
    let { name } = req.body.validatedQueryData;

    const { id } = req.body.validatedParamsData;

    let querySearch: Prisma.ProvinceWhereInput = {
      countryId: id,
    };

    if (
      name &&
      name !== undefined &&
      typeof name === "string" &&
      name.length !== 0
    ) {
      querySearch = {
        ...querySearch,
        name: {
          mode: "insensitive",
          contains: name,
        },
      };
    }
    const provinces = await dbConnection.province.findMany({
      where: querySearch,
    });

    return res.send({
      status: true,
      data: provinces,
      message: "provinces details",
    });
  }

  public static async cities(req: Request, res: Response) {
    let { name } = req.body.validatedQueryData;
    const { id } = req.body.validatedParamsData;
    let querySearch: Prisma.CityWhereInput = { provinceId: id };

    if (
      name &&
      name !== undefined &&
      typeof name === "string" &&
      name.length !== 0
    ) {
      querySearch = {
        ...querySearch,
        name: {
          mode: "insensitive",
          contains: name,
        },
      };
    }
    const cities = await dbConnection.city.findMany({ where: querySearch });

    return res.send({
      status: true,
      data: cities,
      message: "cities details",
    });
  }
}
