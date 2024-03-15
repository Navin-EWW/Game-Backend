import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const seed = async () => {

    const usersData = await users()
    usersData.forEach(async (user) => {
        const checkIfUserExist = await prisma.admin.findFirst({
            where: {
                email: user.email
            }
        });
        if (checkIfUserExist) {
            console.log(
                `${user.email} already exists so updating `
            );
            await prisma.admin.update({
                where: {
                    id: checkIfUserExist.id,
                },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profilePic: user.profilePic,
                    password: user.password ? await bcrypt.hashSync(user.password) : "",

                }
            })
        } else {
            console.log(
                ` create new user for ${user.email}`
            );
            await prisma.admin.create({
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profilePic: user.profilePic,
                    password: user.password ? await bcrypt.hashSync(user.password) : "",

                }
            })

        }
    })

}
const USERS: Prisma.AdminUncheckedCreateInput[] = [];

export async function createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profilePic: string
): Promise<Prisma.AdminUncheckedCreateInput> {
    return {
        firstName,
        lastName,
        email,
        password,
        profilePic
    };
}

export const users = async () => {

    USERS.push(await createUser(
        "deleoper",
        "eww",
        "developer.eww@gmail.com",
        "Admin@1234",
        "https://driveanycars-dev.s3.us-east-2.amazonaws.com/ADMIN/1708671258299-569419484.jpg"
    ));
    USERS.push(await createUser(
        "Fiza",
        "Belim",
        "fizaeww@gmail.com",
        "Admin@1234",
        "https://driveanycars-dev.s3.us-east-2.amazonaws.com/ADMIN/1708671258299-569419484.jpg"
    ));



    return USERS;
};


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
