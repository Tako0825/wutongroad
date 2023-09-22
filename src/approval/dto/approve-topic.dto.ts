import { IsNotEmpty } from "class-validator"

export class ApproveTopicDto {
    @IsNotEmpty({ message: "管理员 uuid 不能为空" })
    admin_id: string
    @IsNotEmpty({ message: "话题 uuid 不能为空" })
    topic_id: string
}