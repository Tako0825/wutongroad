import { $Enums, User } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class CreateUserDto implements Partial<User> {
    @IsNotEmpty({ message: "openid不能为空" })
    openid: string
    @IsNotEmpty({ message: "session_key不能为空" })
    session_key: string
    @IsNotEmpty({ message: "用户角色不能为空" })
    role: $Enums.RoleType
}