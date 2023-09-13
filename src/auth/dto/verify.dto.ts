import { IsNotEmpty } from "class-validator";

export class VerifyDTO {
    @IsNotEmpty({ message:"signature 不允许为空, 请使用 wx.getUserInfo 获取" })
    signature: string
}
