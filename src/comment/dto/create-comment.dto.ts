import { PartialType } from "@nestjs/mapped-types";
import { Comment } from "../entities/comment.entity";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDto extends PartialType(Comment) { 
    @IsNotEmpty({ message: "评论内容不能为空" })
    content: string
    @IsNotEmpty({ message: "请为该评论指定用户uuid" })
    user_id: string
    @IsNotEmpty({ message: "请为该评论指定话题uuid" })
    topic_id: string
    parent_id?: string = null
}
