import { PrismaClient } from "@prisma/client";
import { Random } from "mockjs";

async function main() {
    const prisma = new PrismaClient()

    const users = await prisma.user.findMany()
    const uuidRandom_user = users[Random.integer(0,users.length-1)].uuid

    const categories = await prisma.category.findMany()
    const uuidRandom_category = categories[Random.integer(0,categories.length-1)].uuid

    await prisma.topic.create({
        data: {
            content: Random.cparagraph(10),
            title: Random.ctitle(2,4),
            category_id: uuidRandom_category,
            user_id: uuidRandom_user
        }
    })
}

for(let i=0; i<5; i++) {
    main()
}