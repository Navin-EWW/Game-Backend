
import { Devices, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const seed = async () => {

    const apps = [
        {
            label: "iOS App",
            version: "1.0.0",
            deviceType: Devices.IOS
        },
        {
            label: "Andriod App",
            version: "1.0.0",
            deviceType: Devices.ANDROID
        }
    ]
    apps.forEach(async (app) => {
        const checkIfAppExist = await prisma.appSetting.findFirst({
            where: {
                deviceType: app.deviceType,
            },
        });
        if (checkIfAppExist) {
            console.log(
                `${app.deviceType} already exists so updating `
            );
            await prisma.appSetting.update({
                where: {
                    id: checkIfAppExist.id,
                },
                data: {
                    label: app.label,
                    version: app.version,
                }
            })
        } else {
            console.log(
                ` create new for ${app.deviceType}`
            );
           await prisma.appSetting.create({
            data:{
                label:app.label,
                version:app.version,
                deviceType:app.deviceType
            }
           })
        }
    })

}

seed()
    .then(async () => {
        console.log("app setting seeding completed");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.log("app setting seeding failed");
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
