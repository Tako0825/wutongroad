import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class GenderRule implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): boolean | Promise<boolean> {
        return new Promise(resolve => {
            resolve((value === "男" || value === "女")?true:false)
        })
    }
}