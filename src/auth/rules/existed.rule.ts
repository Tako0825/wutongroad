import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/prisma/prisma.service";

@ValidatorConstraint()
export class ExistedRule implements ValidatorConstraintInterface {
    constructor(
        private prisma = new PrismaService()
    ) {}

    validate(value: any, args?: ValidationArguments): boolean | Promise<boolean> {
        return new Promise(async resolve => {
            const user = await this.prisma.user.findFirst({
                where: {
                    name: value
                }
            })
            resolve(user?false:true)
        })
    }
}