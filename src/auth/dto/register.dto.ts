import { IsNotEmpty,Validate } from "class-validator"
import { ConfirmedRule } from "../rules/confirmed.rule"
import { ExistedRule } from "../rules/existed.rule"

export class RegisterDTO {
    @IsNotEmpty({ message: "用户名不能为空" })
    @Validate(ExistedRule, { message: "用户名已存在" })
    name: string
    @IsNotEmpty({ message: "密码不能为空" })
    password: string
    @IsNotEmpty({ message: "确认密码不能为空" })
    @Validate(ConfirmedRule, { message: "两次密码不匹配" })
    password_confirmed: number
}
