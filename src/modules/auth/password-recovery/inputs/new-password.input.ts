import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from "class-validator";
import { IsPasswordMatchingConstraint } from "src/shared/decorators/is-password-matching-constraint.decorator";

@InputType()
export class NewPasswordInput {

    @Field(() => String)
    @MinLength(8)
    @IsNotEmpty()
    @IsString()
    public password : string

    @Field()
    @MinLength(8)
    @IsNotEmpty()
    @IsString()
    @Validate(IsPasswordMatchingConstraint)
    public passwordRepeat : string

    @Field(() => String)
    @IsUUID("4")
    @IsNotEmpty()
    public token: string
}