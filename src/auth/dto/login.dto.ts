import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message:"js_code不能为空, 请使用 wx.login 获取" })
    js_code: string
}
