import { Comment } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDto implements Partial<Comment> { 
    @IsNotEmpty({ message: "评论内容不能为空" })
    content: string
    user_id: string
    topic_id: string
    parent_id?: string = null
}
