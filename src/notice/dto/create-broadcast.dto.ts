import { Broadcast } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateBroadcastDto implements Partial<Broadcast> {
    @IsNotEmpty({ message: "广播内容不能为空" })
    content: string
    @IsNotEmpty({ message: "发送人不能为空" })
    sender_id: string
}