import { GamePackages } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const gamePackagesResponse = (data: GamePackages | GamePackages[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }
  return objectResponse(data);
};

const objectResponse = (gamePackagesres: GamePackages) => {
  return {
    id: gamePackagesres.id,
    title: gamePackagesres.title,
    discription: gamePackagesres.discription,
    discount: gamePackagesres.discount,
    image: gamePackagesres.image ? ImageUrlChange(gamePackagesres.image) : null,
    price: gamePackagesres.price,
    discountedPrice: gamePackagesres.discountedPrice,
    status: gamePackagesres.status,
    totalGame: gamePackagesres.totalGame,
    createdAt: gamePackagesres.createdAt,
    updatedAt: gamePackagesres.updatedAt,
    deletedAt: gamePackagesres.deletedAt,
  };
};
function discountedPrice(price: string, discount: string) {
  const priceValue: number = Number(price) -
    Number(
      calculatePercentageOfNumber(
        Number(discount),
        Number(price)
      )
    )
  return Math.round(priceValue)
}
function calculatePercentageOfNumber(percentage: number, number: number): string {
  if (percentage > 100) number
  const result: number = number * (percentage / 100);
  return result.toFixed(2);
}
