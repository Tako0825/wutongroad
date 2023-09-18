import { $Enums, Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateNoticeDto implements Partial<Notice> {
    @IsNotEmpty({ message: "通知类型不能为空" })
    type: $Enums.NoticeType;
    @IsNotEmpty({ message: "通知内容不能为空" })
    content: string;
    @IsNotEmpty({ message: "收件人不能为空" })
    recipient_id: string;
    @IsNotEmpty({ message: "寄件人不能为空" })
    sender_id: string;
}
