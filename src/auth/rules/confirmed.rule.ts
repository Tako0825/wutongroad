import { ValidationArguments, ValidatorConstraint ,ValidatorConstraintInterface } from "class-validator"

@ValidatorConstraint()
export class ConfirmedRule implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): boolean | Promise<boolean> {
        return new Promise(resolve => {
            resolve((args.object as any).password === value?true:false)
        })
    }
}