import { Prisma, PromoCode } from "@prisma/client";
import { UserResponse } from "./UserResponse";

export const PromoCodeResponse = (
  data: Prisma.PromoCodeSelect | Prisma.PromoCodeSelect[]
) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (code: Prisma.PromoCodeSelect) => {
  return {
    id: code.id,
    user: code.User,
    promoCode: code.promoCode,
    userId: code.userId,
    discount: code.discount,
    discountType: code.discountType,
    validFrom: code.validFrom,
    validTill: code.validTill,
    createdAt: code.createdAt,
  };
};
