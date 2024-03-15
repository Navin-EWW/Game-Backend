import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { Status } from "@prisma/client";

export class DashboardController {
  public static async dashboard(req: Request, res: Response) {
    const game: any[] = [];
    const totalCategory = await dbConnection.gamesCategory.findMany({
      where: { status: Status.ACTIVE, deletedAt: null }
    })
    const users = [
      { count: totalCategory.length, displayName: "Categories" },
      { count: 0, displayName: "Special Games" },
    ];

    return res.json({
      status: true,
      data: game,
      message: "Dashboard data fetched successfully",
      users: users,
    });
  }
}
