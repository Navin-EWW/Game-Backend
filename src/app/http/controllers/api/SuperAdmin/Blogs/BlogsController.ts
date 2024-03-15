import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { BlogResponse } from "../../../../responses/BlogsResponse";
import { createSlug, pagination } from "../../../../../../utils/utils";
import { Prisma } from "@prisma/client";

export class BlogsController {
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

    let querySearch: Prisma.BlogsWhereInput = {
      deletedAt: undefined,
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
            title: {
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
          {
            slug: {
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

    let findManyQuery: Prisma.BlogsFindManyArgs = {
      where: querySearch,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        status: true,
      },
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
    };

    const totalCount = await dbConnection.blogs.count({
      where: querySearch,
    });
    const pages =
      totalCount > 0 ? await dbConnection.blogs.findMany(findManyQuery) : [];

    return res.json({
      status: true,
      data: pages,
      pagination: pagination(totalCount, perPage, page),
    });
  }

  public static async add(req: Request, res: Response) {
    const { title, description, image } = req.body.validatedData;

    const findBlog = await dbConnection.blogs.findFirst({
      where: {
        title: title,
        deletedAt: undefined,
      },
    });

    if (findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.already_exists", { model: "Blog" }),
      });
    }

    const addBlog = await dbConnection.blogs.create({
      data: {
        slug: createSlug(title),
        title: title,
        image: image,
        status: "ACTIVE",
        description: description,
      },
    });

    return res.json({
      status: true,
      data: BlogResponse(addBlog),
      message: req.t("crud.created", { model: "Blog" }),
    });
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { title, description, image } = req.body.validatedData;

    const findBlog = await dbConnection.blogs.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Blog" }),
      });
    }

    const updateBlog = await dbConnection.blogs.update({
      where: {
        id,
      },
      data: {
        slug: createSlug(title),
        title,
        description,
        image,
      },
    });
    return res.json({
      status: true,
      data: BlogResponse(updateBlog),
      message: req.t("crud.updated", { model: "Blog" }),
    });
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;

    const findBlog = await dbConnection.blogs.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Blog" }),
      });
    }

    const updateBlog = await dbConnection.blogs.update({
      where: {
        id,
      },
      data: { deletedAt: new Date() },
    });
    return res.json({
      status: true,
      data: BlogResponse(updateBlog),
      message: req.t("crud.deleted", { model: "Blog" }),
    });
  }

  public static async view(req: Request, res: Response) {
    const { slug } = req.body.validatedParamsData;

    const findBlog = await dbConnection.blogs.findFirst({
      where: {
        slug: slug,
        deletedAt: undefined,
      },
    });

    if (!findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Blog" }),
      });
    }

    return res.json({
      status: true,
      data: BlogResponse(findBlog),
      message: req.t("crud.details", { model: "Blog" }),
    });
  }

  public static async status(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const findBlog = await dbConnection.blogs.findFirst({
      where: {
        id,
        deletedAt: undefined,
      },
    });

    if (!findBlog) {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Blog" }),
      });
    }
    const updateStatus = await dbConnection.blogs.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    return res.json({
      status: true,
      data: BlogResponse(updateStatus),
      message: req.t("crud.status", { model: "Blog" }),
    });
  }
}
