import { HttpException, HttpStatus, ValidationError, ValidationPipe } from "@nestjs/common";

export class Validation extends ValidationPipe {
    constructor(

    ) {
        super()
    }

    // 格式化 - DTO 验证失败信息
    protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
        const errors = new Object()
        validationErrors.forEach(item => {
            errors[item.property] = Object.values(item.constraints)[0]
        })
        throw new HttpException({
            meta: errors,
        }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
}