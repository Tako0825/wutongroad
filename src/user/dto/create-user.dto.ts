import { IsNotEmpty, IsUrl, Validate } from "class-validator"
import { GenderRule } from "../rule/gender.rule"

export class CreateUserDto {
    uuid: string
    @IsNotEmpty({ message: "用户名不能为空" })
    nickname: string
    role: string
    @Validate(GenderRule, { message: '性别仅可为男或女' })
    gender: "男" | "女" | null
    @IsUrl(null, {message: "请提供一个 URL 格式的图片地址"})
    avatar: string
    create_time: Date
    openid: string
    session_sky: string
}