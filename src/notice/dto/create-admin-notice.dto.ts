import { $Enums, Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateAdminNoticeDto implements Partial<Notice>{
    @IsNotEmpty({ message: "通知类型不能为空" })
    type: $Enums.NoticeType = "admin"
    @IsNotEmpty({ message: "通知内容不能为空" })
    content: string;
    @IsNotEmpty({ message: "寄件人不能为空" })
    sender_id: string;
    recipient_id?: string;
}