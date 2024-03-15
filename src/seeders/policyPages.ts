import { PolicyPageTypes, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const seed = async () => {

    try {
        // Create a new policy page type entry
        await prisma.policyPage.createMany({
            data: [
                {
                    title: "test",
                    description: "test",
                    type: PolicyPageTypes.AboutUs,
                },
                {
                    title: "test",
                    description: "test",
                    type: PolicyPageTypes.PrivacyPolicy,
                },
                {
                    title: "test",
                    description: "test",
                    type: PolicyPageTypes.TermAndCondition,
                }
            ],
        });
        console.log("Policy page seeded successfully.");
    } catch (error) {
        console.error("Error seeding policy page type:", error);
        throw error;
    }
}



seed()
    .then(async () => {
        console.log("admin seeding completed");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.log("admin seeding failed");
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
