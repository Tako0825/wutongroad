import { IsNotEmpty, Validate } from "class-validator"
import { MatchRule } from "../rules/match.rule"

export class LoginDTO {
    @IsNotEmpty({ message: "用户名不能为空" })
    @Validate(MatchRule, { message: "用户名和密码不匹配" })
    name: string
    @IsNotEmpty({ message: "密码不能为空" })
    password: string
}
