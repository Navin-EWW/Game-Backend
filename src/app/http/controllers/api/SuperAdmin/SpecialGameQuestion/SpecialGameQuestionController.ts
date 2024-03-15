import { Request, Response } from "express";
import dbConnection from "../../../../../providers/db";
import { Class, Prisma } from "@prisma/client";
import { pagination } from "../../../../../../utils/utils";
import { SpecialGamesQuestionResponse } from "../../../../responses/SpecialGamesQuestionResponse";
import { SpecialGamesCategoryResponse } from "../../../../responses/SpecialGameCategoryResponse";

export class SpecialGameQuestionController {
  public static async index(req: Request, res: Response) {
    const { page, perPage } = req.body.pagination;
    const { sortBy, sortType } = req.body.validatedSortData;
    let { search, toDate, fromDate, status, classValue, category, questionTypeView,categoryId } =
      req.body.validatedQueryData;

    const newtoDate = new Date(toDate).setHours(23, 59, 59, 999);
    const newfromDate = new Date(fromDate).setHours(0, 0, 0, 0);
    let sort: any = {
      createdAt: "desc",
    };

    let querySearch: Prisma.SpecialGamesQuestionWhereInput = {
      deletedAt: null,
    };

    
    if (categoryId) {
      querySearch = {
        ...querySearch,
        categoryId:categoryId
      }
    }

    if (category) {
      querySearch = {
        ...querySearch,
        SpecialGamesCategory: {
          name: category,
        }
      }
    }

    if (questionTypeView) {
      querySearch = {
        ...querySearch,
        questionTypeView: questionTypeView
      }
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
            SpecialGamesCategory: {
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

    if (sortBy !== undefined) {
      sort = {
        [sortBy]: sortType,
      };
    }

    let findManyQuery: Prisma.SpecialGamesQuestionFindManyArgs = {
      where: querySearch,
      orderBy: sort,
      skip: perPage * (page - 1),
      take: perPage,
      include: {
        SpecialGamesCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };

    const totalCount = await dbConnection.specialGamesQuestion.count({
      where: querySearch,
    });

    let questions: any =
      totalCount > 0
        ? await dbConnection.specialGamesQuestion.findMany(findManyQuery)
        : [];

    return res.json({
      status: true,
      data: SpecialGamesQuestionResponse(questions),
      pagination: pagination(totalCount, perPage, page),
    });
  }
  public static async addQuestion(req: Request, res: Response) {
    const {
      categoryId,
      question,
      correctAnswer,
      layoutTemplate,
      classValue,
      image,
      video,
      audio,
      correctAnswerMedia,
      questionTypeView
    } = req.body.validatedData;
    console.log(req.body.validatedData, "image===============");

    // const FindQuestion = await dbConnection.specialGamesQuestion.findFirst({
    //   where: {
    //     question: question,
    //   },
    // });

    // if (FindQuestion) {
    //   return res.status(400).json({
    //     status: false,
    //     message: req.t("crud.already_exists", { model: "Game Question" }),
    //   });
    // }

    const Question: any = await dbConnection.specialGamesQuestion.create({
      data: {
        categoryId: categoryId,
        question: question,
        class: classValue,
        layoutTepmplate: layoutTemplate,
        correctAnswer: correctAnswer,
        image: image ? image : [],
        video: video ? video : [],
        audio: audio ? audio : [],
        deletedAt: null,
        correctAnswerMedia: correctAnswerMedia,
        questionTypeView: questionTypeView,
      },
      include: {
        SpecialGamesCategory: {
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
        data: SpecialGamesQuestionResponse(Question),
        message: req.t("crud.created", { model: "Special Game Question" }),
      });
    }
  }

  public static async updateQuestion(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const {
      categoryId,
      question,
      correctAnswer,
      layoutTemplate,
      classValue,
      image,
      video,
      audio,
      questionTypeView,
      correctAnswerMedia
    } = req.body.validatedData;
  
    const FindQuestion = await dbConnection.specialGamesQuestion.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindQuestion) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Question" }),
      });
    }

    const Question: any = await dbConnection.specialGamesQuestion.update({
      where: { id: id },
      data: {
        categoryId: categoryId,
        question: question,
        correctAnswerMedia: correctAnswerMedia,
        questionTypeView: questionTypeView,
        class: classValue,
        layoutTepmplate: layoutTemplate,
        correctAnswer: correctAnswer,
        image: image,
        video: video,
        audio: audio,
      },
      include: {
        SpecialGamesCategory: {
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
        data: SpecialGamesQuestionResponse(Question),
        message: req.t("crud.updated", { model: "Special Game Question" }),
      });
    }
  }

  public static async deleteQuestion(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const FindQuestion = await dbConnection.specialGamesQuestion.findFirst({
      where: {
        id: id,
      },
    });

    if (!FindQuestion) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Question" }),
      });
    }

    const Question: any = await dbConnection.specialGamesQuestion.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        SpecialGamesCategory: {
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
        data: SpecialGamesQuestionResponse(Question),
        message: req.t("crud.deleted", { model: "Special Game Question" }),
      });
    }
  }

  public static async deleteManyQuestion(req: Request, res: Response) {
    const { questionIds } = req.body.validatedData;
const FindQuestions = await dbConnection.specialGamesQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });
    if (!FindQuestions) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Question" }),
      });
    }
      const Question:any = FindQuestions.map(async(record) => {
      return await dbConnection.specialGamesQuestion.update({
        where: { id: record.id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          SpecialGamesCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });




    // const Question: any = await dbConnection.specialGamesQuestion.update({
    //   where: { id: id },
    //   data: {
    //     deletedAt: new Date(),
    //   },
    //   include: {
    //     SpecialGamesCategory: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    if (Question) {
      return res.json({
        status: true,
        data: SpecialGamesQuestionResponse(Question),
        message: req.t("crud.deleted", { model: "Special Game Question" }),
      });
    }

  }
  // public static async deleteManyQuestion(req: Request, res: Response) {
  //   const { id } = req.body.validatedParamsData;
  //   const FindQuestion = await dbConnection.specialGamesQuestion.findFirst({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   if (!FindQuestion) {
  //     return res.status(400).json({
  //       status: false,
  //       message: req.t("crud.not_found", { model: "Special Game Question" }),
  //     });
  //   }

  //   const Question: any = await dbConnection.specialGamesQuestion.update({
  //     where: { id: id },
  //     data: {
  //       deletedAt: new Date(),
  //     },
  //     include: {
  //       SpecialGamesCategory: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });
  //   if (Question) {
  //     return res.json({
  //       status: true,
  //       data: SpecialGamesQuestionResponse(Question),
  //       message: req.t("crud.deleted", { model: "Special Game Question" }),
  //     });
  //   }
  // }

  public static async statusChange(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    const { status } = req.body.validatedData;

    const statusUpdate: any = await dbConnection.specialGamesQuestion.update({
      where: { id: id },
      data: {
        status: status,
      },
      include: {
        SpecialGamesCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      status: true,
      data: SpecialGamesQuestionResponse(statusUpdate),
      message: req.t("crud.updated", { model: "Special Game Question" }),
    });
  }

  public static async specialCategoryList(req: Request, res: Response) {
    const allCategories = await dbConnection.specialGamesCategory.findMany({
      where: {
        // status: Status.ACTIVE,
        deletedAt: null,
      },
    });
    if (allCategories) {
      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(allCategories),
        message: req.t("crud.list", { model: "Special Game Category" }),
      });
    } else {
      return res.json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Category" }),
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
  //   const questionTypes = Object.values(QuestionType);
  //   if (questionTypes.length) {
  //     return res.json({
  //       status: true,
  //       data: questionTypes,
  //       message: req.t("crud.list", { model: "Question Type" }),
  //     });
  //   } else {
  //     return res.json({
  //       status: false,
  //       message: req.t("crud.not_found", { model: "Question Type" }),
  //     });
  //   }
  // }

  public static async QuestionDuplicate(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData
    const question = await dbConnection.specialGamesQuestion.findFirst({
      where: { id: id }
    })
    if (question) {
      const newQuestion: any = await dbConnection.specialGamesQuestion.create({
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
          deletedAt: null
        },
        include: {
          SpecialGamesCategory: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return res.json({
        status: true,
        data: SpecialGamesCategoryResponse(newQuestion),
        message: req.t('crud.created', { model: 'Duplicate question' })
      });
    } else {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Special Game Question" }),
      });
    }
  }
}
