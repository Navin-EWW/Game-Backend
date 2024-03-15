import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();
const seed = async () => {
    const data = [
        {
            image: "https://dev-seen-jeem.s3.eu-north-1.amazonaws.com/1709286487397-26209509.jpg",
            url: "www.google.com",
            status:Status.ACTIVE,
            deletedAt: null
        },
        {
            image: "https://dev-seen-jeem.s3.eu-north-1.amazonaws.com/1709286487397-26209509.jpg",
            url: "www.google.com",
            status:Status.ACTIVE,
            deletedAt: null,
        }
    ]
    try {
        // Create a new policy page type entry
        await prisma.sponsor.createMany({
            data: data
        });
        console.log("sponsor seeded successfully.");
    } catch (error) {
        console.error("Error seeding sponsor", error);
        throw error;
    }
}



seed()
    .then(async () => {
        console.log("sponsor seeding completed");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.log("sponsor seeding failed");
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
