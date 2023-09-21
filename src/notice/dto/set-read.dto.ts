import { Notice } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class SetReadDto implements Partial<Notice> {
    @IsNotEmpty()
    uuid?: string;
}