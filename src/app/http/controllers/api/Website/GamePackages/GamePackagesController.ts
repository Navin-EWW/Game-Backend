import { Request, Response } from "express";
import { gamePackagesResponse } from "../../../../responses/GamePackagesResponse";
import dbConnection from "../../../../../providers/db";
import { Status } from "@prisma/client";


export class GamePackagesController {
  public static async index(req: Request, res: Response) {
    const packages = await dbConnection.gamePackages.findMany({
      where: {
        status: Status.ACTIVE,
        deletedAt: null
      }
    })

    if (!packages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: `Game Packages` }),
      });
    }

    return res.send({
      status: true,
      data: gamePackagesResponse(packages)
    });
  }

  public static async userPackage(req: Request, res: Response) {

    const { id } = req.body.auth.user
    let packages = await dbConnection.gamePackages.findMany({
      where: {
        status: Status.ACTIVE,
        deletedAt: null
      }, orderBy: {
        createdAt: 'desc'
      }
    })

    const userPackages = await dbConnection.gamePackagePaymentHistory.findMany({
      where: { userId: id, result: 'NOT CAPTURED' }
    })

    packages = packages.map(pkg => {
      const purchased = userPackages.some(userPkg => userPkg.packageId === pkg.id);
      return { ...pkg, purchased };
    });

    if (!packages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: `Game Packages` }),
      });
    }

    return res.send({
      status: true,
      data: gamePackagesResponse(packages)
    });
  }

}
