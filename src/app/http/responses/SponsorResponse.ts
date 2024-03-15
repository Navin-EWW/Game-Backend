import { PolicyPage, Sponsor } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const SponsorResponse = (data: Sponsor | Sponsor[]) => {
    if (Array.isArray(data)) {
        return data.map((d) => objectResponse(d));
    }

    return objectResponse(data);
};

const objectResponse = (sponsor: Sponsor) => {
    return {
        id: sponsor.id,
        url: sponsor.url,
        image: ImageUrlChange(sponsor.image),
        status: sponsor.status,
        createdAt: sponsor.createdAt,
        updatedAt: sponsor.updatedAt
    };
};
