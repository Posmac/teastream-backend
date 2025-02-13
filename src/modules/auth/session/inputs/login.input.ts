import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from "class-validator";

@InputType()
export class LoginInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    public login: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string

    @Field(() => String, {nullable: true})
    @IsString()
    @Length(6,6)
    @IsOptional()
    public pin: string
}