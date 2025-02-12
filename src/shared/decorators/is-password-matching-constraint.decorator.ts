import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { NewPasswordInput } from "src/modules/auth/password-recovery/inputs/new-password.input";


@ValidatorConstraint({name: "IsPasswordMatching", async: false})
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {

    validate(passwordRepeat: string, validationArguments: ValidationArguments): boolean {
        
        const object = validationArguments.object as NewPasswordInput
        return object.password === passwordRepeat
    }

    defaultMessage?(validationArguments: ValidationArguments): string {
        return "Password aren`t equal"
    }
}