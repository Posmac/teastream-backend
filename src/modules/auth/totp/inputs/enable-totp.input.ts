import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, isNotEmpty, IsString, Length, MinLength } from "class-validator";

@InputType()
export class EnableTotpInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    public secret: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    public pin: string
}