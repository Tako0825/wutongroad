import { IsNotEmpty } from "class-validator";

export class LoginDTO {
    @IsNotEmpty({ message:"请你使用 wx.login 获取正确的 code" })
    js_code: string
}
