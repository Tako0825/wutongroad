import { IsNotEmpty } from "class-validator";

export class GetAllDto {
    @IsNotEmpty()
    recipient_id: string
}