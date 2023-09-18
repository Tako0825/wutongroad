import { $Enums, Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class SystemNoticeDto implements Partial<Notice> {
    @IsNotEmpty({ message: "消息内容不能为空" })
    content: string;
    @IsNotEmpty({ message: "收件人不能为空" })
    recipient_id: string;
}
