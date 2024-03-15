import { Router } from "express";
import { RequestParamsValidator, RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { userVerifyToken } from "../../../app/http/middleware/Auth";
import { GameAnswerSumbmitRequestSchema, GameBoardRequestSchema, GameExitRequestSchema, GameLifelineRequestSchema, GameQuestionRequestSchema, GameRequestSchema, GameShuffleRequestSchema } from "../../../app/http/requests/GameRequest";
import { GameController } from "../../../app/http/controllers/api/Website/Game/GameController";


const router = Router();

router.post(
    "/start-game",
    userVerifyToken,
    RequestValidator(GameRequestSchema),
    GameController.startGame
);

router.get(
    "/game-board/:gameId",
    userVerifyToken,
    RequestParamsValidator(GameBoardRequestSchema),
    GameController.gameBoard
);

router.post(
    "/game-question",
    userVerifyToken,
    RequestValidator(GameQuestionRequestSchema),
    GameController.gameQuestion
);

router.post(
    "/answer-submit",
    userVerifyToken,
    RequestValidator(GameAnswerSumbmitRequestSchema),
    GameController.answerSubmit
);

router.post(
    "/game-lifeline",
    userVerifyToken,
    RequestValidator(GameLifelineRequestSchema),
    GameController.gameLifeline
);


router.post(
    "/game-exit",
    userVerifyToken,
    RequestValidator(GameExitRequestSchema),
    GameController.gameExit
);

router.get(
    "/game-history",
    userVerifyToken,
    GameController.gameHistory
)

router.post(
    "/game-shuffle",
    userVerifyToken,
    RequestValidator(GameShuffleRequestSchema),
    GameController.gameShuffle
);
export default router;