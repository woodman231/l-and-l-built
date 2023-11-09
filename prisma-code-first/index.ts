import { PrismaClient } from "@prisma/client"

async function main() {
    const prismaClient = new PrismaClient();

    await createOneEntity(prismaClient);

    console.log("Created a new one, getting a list of all of them...");

    await getAllEntities(prismaClient);
}

async function createOneEntity(prismaClient: PrismaClient) {
    await prismaClient.myEntity.create({
        data: {
            title: "Hello World!"
        }
    });
}

async function getAllEntities(prismaClient: PrismaClient) {
    const allEntities = await prismaClient.myEntity.findMany();

    console.log(JSON.stringify(allEntities));
}

main();