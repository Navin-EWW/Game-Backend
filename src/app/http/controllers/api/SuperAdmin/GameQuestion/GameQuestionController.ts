import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { Class, Prisma, Status, GamesQuestion } from "@prisma/client";
import { ImageUrlChange, pagination } from "../../../../../../utils/utils";
import { GamesQuestionResponse } from "../../../../responses/GamesQuestionResponse";
import { GamesCategoryResponse } from "../../../../responses/GameCategoryResponse";

export class GameQuestionController {
  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;

    const { sortBy, sortType } = req.body.validatedSortData;
    let {
      search,
      toDate,
      fromDate,
      status,
      classValue,
      questionTypeView,
      categoryId,
    } = req.body.validatedQueryData;
    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.GamesQuestionWhereInput = {
      deletedAt: null,
    };

    if (categoryId) {
      querySearch = {
        ...querySearch,
        GameCategory: {
          id: categoryId,
        },
      };
    }

    if (questionTypeView) {
      querySearch = {
        ...querySearch,
        questionTypeView: questionTypeView,
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
    if (status) {
      querySearch = {
        ...querySearch,
        status: status,
      };
    }
    if (classValue) {
      querySearch = {
        ...querySearch,
        class: classValue,
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
            question: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            GameCategory: {
              name: {
                contains: search,
                mode: "insensitive", // Case-insensitive search
              },
            },
          },
          {
            correctAnswer: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
        ],
      };
    }

    if (sortBy === "category") {
      sort = {
        GameCategory: {
          name: sortType,
        },
      };
    } else {
      if (sortBy !== undefined) {
        sort = {
          [sortBy]: sortType,
        };
      }
    }

    let findManyQuery: Prisma.GamesQuestionFindManyArgs = {
      where: querySearch,
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
      include: {
        GameCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };

    const totalCount = await dbConnection.gamesQuestion.count({
      where: querySearch,
    });

    let questions: any =
      totalCount > 0
        ? await dbConnection.gamesQuestion.findMany(findManyQuery)
        : [];

    return res.json({
      status: true,
      data: GamesQuestionResponse(questions),
      pagination: pagination(totalCount, perPage, page),
    });
  }
  public static async addQuestion(req: Request, res: Response) {
    const {
      categoryId,
      question,
      correctAnswer,
      correctAnswerMedia,
      questionTypeView,
      layoutTemplate,
      classValue,
      image,
      video,
      audio,
    } = req.body.validatedData;
    console.log(image, "image===============");

    // const FindQuestion = await dbConnection.gamesQuestion.findFirst({
    //     where: {
    //         question: question
    //     }
    // })

    // if (FindQuestion) {
    //     return res.status(400).json({
    //         status: false,
    //         message: req.t("crud.already_exists", { model: "Game Question" }),
    //     });
    // }

    const Question: any = await dbConnection.gamesQuestion.create({
      data: {
        categoryId: categoryId,
        question: question,
        class: classValue,
        layoutTepmplate: layoutTemplate,
        correctAnswer: correctAnswer,
        correctAnswerMedia: correctAnswerMedia,
        questionTypeView: questionTypeView,
        image: image ? image : [],
        video: video ? video : [],
        audio: audio ? audio : [],
        deletedAt: null,
      },
      include: {
        GameCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (Question) {
      return res.json({
        status: true,
        data: GamesQuestionResponse(Question),
        message: req.t("crud.created", { model: "Game Question" }),
      });
    }
  }

  public static async updateQuestion(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const {
      categoryId,
      question,
      correctAnswer,
      correctAnswerMedia,
      questionTypeView,
      layoutTemplate,
      classValue,
      image,
      video,
      audio,
    } = req.body.validatedData;
    const FindQuestion = await dbConnection.gamesQuestion.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindQuestion) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Question" }),
      });
    }

    const Question: any = await dbConnection.gamesQuestion.update({
      where: { id: id },
      data: {
        categoryId: categoryId,
        question: question,
        class: classValue,
        layoutTepmplate: layoutTemplate,
        correctAnswer: correctAnswer,
        correctAnswerMedia: correctAnswerMedia,
        questionTypeView: questionTypeView,
        image: image,
        video: video,
        audio: audio,
      },
      include: {
        GameCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (Question) {
      return res.json({
        status: true,
        data: GamesQuestionResponse(Question),
        message: req.t("crud.updated", { model: "Game Question" }),
      });
    }
  }

  public static async deleteQuestion(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const FindQuestion = await dbConnection.gamesQuestion.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindQuestion) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Question" }),
      });
    }

    const Question: any = await dbConnection.gamesQuestion.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        GameCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (Question) {
      return res.json({
        status: true,
        data: GamesQuestionResponse(Question),
        message: req.t("crud.deleted", { model: "Game Question" }),
      });
    }
  }
  public static async deleteManyQuestion(req: Request, res: Response) {
    const { questionIds } = req.body.validatedData;

    const FindQuestions = await dbConnection.gamesQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    if (!FindQuestions) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Question" }),
      });
    }

    const Question: any = FindQuestions.map(async (record) => {
      return await dbConnection.gamesQuestion.update({
        where: { id: record.id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          GameCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    // await Promise.all(Question);
    // const Question: any = await dbConnection.gamesQuestion.update({
    //     where: { id: id },
    //     data: {
    //         deletedAt: new Date()
    //     },
    //     include: {
    //         GameCategory: {
    //             select: {
    //                 id: true,
    //                 name: true
    //             }
    //         }
    //     }
    // })

    if (Question) {
      return res.json({
        status: true,
        data: Question ? GamesQuestionResponse(Question) : Question,
        message: req.t("crud.deleted", { model: "Game Question" }),
      });
    }
  }

  public static async statusChange(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const statusUpdate: any = await dbConnection.gamesQuestion.update({
      where: { id: id },
      data: {
        status: status,
      },
      include: {
        GameCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      status: true,
      data: GamesQuestionResponse(statusUpdate),
      message: req.t("crud.updated", { model: "Game Question status" }),
    });
  }

  public static async categoryList(req: Request, res: Response) {
    const allCategories = await dbConnection.gamesCategory.findMany({
      where: {
        // status: Status.ACTIVE,
        deletedAt: null,
      },
    });
    if (allCategories) {
      return res.json({
        status: true,
        data: GamesCategoryResponse(allCategories),
        message: req.t("crud.list", { model: "Game Category" }),
      });
    } else {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Category" }),
      });
    }
  }

  public static async classList(req: Request, res: Response) {
    const classes = Object.values(Class);
    if (classes.length) {
      return res.json({
        status: true,
        data: classes,
        message: req.t("crud.list", { model: "Class" }),
      });
    } else {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Class" }),
      });
    }
  }

  // public static async QuestionTypeList(req: Request, res: Response) {
  //     const questionTypes = Object.values(QuestionType);
  //     if (questionTypes.length) {
  //         return res.json({
  //             status: true,
  //             data: questionTypes,
  //             message: req.t('crud.list', { model: 'Question Type' })
  //         });
  //     } else {
  //         return res.json({
  //             status: false,
  //             message: req.t('crud.not_found', { model: 'Question Type' })
  //         });
  //     }

  // }

  public static async QuestionDuplicate(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const question = await dbConnection.gamesQuestion.findFirst({
      where: { id: id },
    });
    if (question) {
      const newQuestion: any = await dbConnection.gamesQuestion.create({
        data: {
          categoryId: question.categoryId,
          question: question.question,
          class: question.class,
          layoutTepmplate: question.layoutTepmplate,
          correctAnswer: question.correctAnswer,
          correctAnswerMedia: question.correctAnswerMedia,
          questionTypeView: question.questionTypeView,
          image: question.image,
          video: question.video,
          audio: question.audio,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        include: {
          GameCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      console.log("newQuestion==================>", newQuestion);

      return res.json({
        status: true,
        data: GamesQuestionResponse(newQuestion),
        message: req.t("crud.created", { model: "Duplicate question" }),
      });
    } else {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Game Question" }),
      });
    }
  }
}
