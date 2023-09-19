import { IsNotEmpty, Length } from "class-validator"
import { Topic } from "@prisma/client"

export class CreateTopicDto implements Partial<Topic> {
    @Length(1,10,{ message: "话题标题限制长度为1~10" })
    title: string
    @IsNotEmpty({ message: "话题内容不能为空" })
    content: string
    category_id: string
    user_id: string
}
