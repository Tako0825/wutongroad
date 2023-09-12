import { verify } from "argon2";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/prisma/prisma.service";

@ValidatorConstraint()
export class MatchRule implements ValidatorConstraintInterface {
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
            resolve(user && (args.object as any).password && await verify(user.password, (args.object as any).password))
        })
    }
}