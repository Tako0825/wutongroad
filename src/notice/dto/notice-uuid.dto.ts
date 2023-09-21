import { Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class NoticeUuidDto implements Partial<Notice> {
    @IsNotEmpty()
    uuid?: string;
}