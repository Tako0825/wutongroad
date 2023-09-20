import { $Enums, PrismaClient } from "@prisma/client";
import { Random } from "mockjs";
import { v4 } from "uuid";

async function main() {
    const prisma = new PrismaClient()

    const userList = await prisma.user.findMany()
    const uuidRandom_user = userList[Random.integer(0,userList.length-1)].uuid

    const categoryList = await prisma.category.findMany()
    const uuidRandom_category = categoryList[Random.integer(0,categoryList.length-1)].uuid

    const topicList = await prisma.topic.findMany()
    const uuidRandom_topic = topicList[Random.integer(0,topicList.length-1)].uuid

    const commentsList = await prisma.comment.findMany()
    const uuidRandom_comment = commentsList[Random.integer(0,commentsList.length-1)].uuid

    // 在这里造数据
    
}

for(let i=0; i<15; i++) {
    main()
}