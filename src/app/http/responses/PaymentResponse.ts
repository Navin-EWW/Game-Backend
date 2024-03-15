import { GamePackagePaymentHistory } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const gamePackagePaymentResponse = (data: GamePackagePaymentHistory | GamePackagePaymentHistory[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }
  return objectResponse(data);
};

const objectResponse = (gamePackagesres: GamePackagePaymentHistory) => {
  return {
    id: gamePackagesres.id,
    packageId: gamePackagesres.packageId,
    userId: gamePackagesres.userId,
    title: gamePackagesres.title,
    discription: gamePackagesres.discription,
    discount: gamePackagesres.discount,
    image: gamePackagesres.image ? ImageUrlChange(gamePackagesres.image) : null,
    price: gamePackagesres.price,
    discountedPrice:
      Number(gamePackagesres.price) -
      Number(
        calculatePercentageOfNumber(
          Number(gamePackagesres.discount),
          Number(gamePackagesres.price)
        )
      ),
    totalGame: gamePackagesres.totalGame,
    createdAt: gamePackagesres.createdAt,
    updatedAt: gamePackagesres.updatedAt,
    deletedAt: gamePackagesres.deletedAt,
  };
};

function calculatePercentageOfNumber(percentage: number, number: number): string {
  if (percentage > 100) number
  const result: number = number * (percentage / 100);
  return result.toFixed(2);
}
