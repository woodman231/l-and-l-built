import { Prisma, PrismaClient } from "@prisma/client"
const prismaClient = new PrismaClient();

async function main() {
    await createOneEntity();

    console.log("Created a new one, getting a list of all of them...");

    await getAllEntities();

    console.log("Getting just a list of titles...");
    await getAllTitles();
}

async function createOneEntity() {
    await prismaClient.myEntity.create({
        data: {
            title: "Hello World!"
        }
    });
}

async function getAllEntities() {
    const allEntities = await prismaClient.myEntity.findMany();

    console.log(JSON.stringify(allEntities));
}

async function getAllTitles() {
    const selector : Prisma.MyEntitySelect = {
        title: true
    }

    const allTitles = await prismaClient.myEntity.findMany({select: selector});

    console.log(JSON.stringify(allTitles));
}

main()
    .then(async () => {
        await prismaClient.$disconnect()    
    })
    .catch(async (e) => {
        console.log(e);
        await prismaClient.$disconnect();
        process.exit(1);
    })