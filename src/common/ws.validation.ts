import { HttpException, HttpStatus, ValidationError, ValidationPipe } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

export class WsValidation extends ValidationPipe {
    constructor() {
        super()
    }

    // 格式化 DTO 管道验证失败时的异常信息
    protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
        const errors = new Object()
        validationErrors.forEach(item => {
            errors[item.property] = Object.values(item.constraints)[0]
        })
        throw new WsException(new HttpException({
            tip: "数据校验失败"
        }, HttpStatus.UNPROCESSABLE_ENTITY))
    }
}