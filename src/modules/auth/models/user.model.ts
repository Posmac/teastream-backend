import { Field, ID, ObjectType } from "@nestjs/graphql";
import type { User } from "prisma/generated";

@ObjectType({
    description: "User module"
})
export class UserModel implements User {
    
    @Field(() => ID)
    id: string

    @Field(() => String)
    email: string

    @Field(() => String)
    password: string

    @Field(() => String)
    username: string

    @Field(() => String)
    display_name: string

    @Field(() => String, {nullable: true})
    avatar: string

    @Field(() => String, {nullable: true})
    bio: string

    @Field(() => Date)
    created_at: Date

    @Field(() => Date)
    updated_at: Date
}