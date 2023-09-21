import { Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class NoticeRecipientIdDto implements Partial<Notice> {
    @IsNotEmpty()
    recipient_id: string
}