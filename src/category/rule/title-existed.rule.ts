import { PrismaClient } from "@prisma/client";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class TitleExistedRule implements ValidatorConstraintInterface {
    constructor(
        private prisma = new PrismaClient()
    ) {}

    validate(value: any, args?: ValidationArguments): boolean | Promise<boolean> {
        return new Promise(async resolve => {
            const category = await this.prisma.category.findFirst({
                where: {
                    title: value
                }
            })
            resolve(category?false:true)
        })
    }
}