import { PrismaClient } from "@prisma/client";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class UserExistedRule implements ValidatorConstraintInterface {
    constructor(
        private prisma = new PrismaClient()
    ) {}

    // 验证是否存在与当前 uuid 对应的用户
    validate(value: any, args?: ValidationArguments): boolean | Promise<boolean> {
        return new Promise(async resolve => {
            try {
                await this.prisma.user.findUnique({
                    where: {
                        uuid: value
                    }
                })
                resolve(true)
            } catch(error) {
                resolve(false)
            }
        })
    }
}