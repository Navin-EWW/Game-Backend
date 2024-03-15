import { ContactUs } from "@prisma/client";

export const ContactUsResponse = (data: ContactUs | ContactUs[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }
  return objectResponse(data);
};

const objectResponse = (contactUs: ContactUs) => {
  return {
    id: contactUs.id,
    name: contactUs.name,
    email: contactUs.email,
    phoneNumber: contactUs.phoneNumber,
    discription: contactUs.discription,
    createdAt: contactUs.createdAt,
    updatedAt: contactUs.updatedAt,
    deletedAt: contactUs.deletedAt,
  };
};


