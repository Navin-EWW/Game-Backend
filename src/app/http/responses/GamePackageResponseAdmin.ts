import { GamePackagePaymentHistory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";
export const GamePackagesResponseAdmin = (data: GamePackagePaymentHistory | GamePackagePaymentHistory[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = (game: GamePackagePaymentHistory) => {
    return {
        id: game.id,
        userId: game.userId,
        title: game.title,
        discription: game.discription,
        totalGame: game.totalGame,
        useGame: 0,
        image: game.image ? ImageUrlChange(game.image) : null,
    };
};