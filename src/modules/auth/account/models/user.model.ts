import { Field, ID, ObjectType } from "@nestjs/graphql";
import { isNullableType } from "graphql";
import type { User } from "prisma/generated";
import { SocialLinkModel } from "../../profile/models/social-link.model";

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

    @Field(() => Boolean)
	public isVerified: boolean

	@Field(() => Boolean)
	public isEmailVerified: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean
    
    @Field(()=> String, {nullable: true})
    public totpSecret: string

    @Field(() => Boolean)
    isDeactivated : boolean

    @Field(() => Date, {nullable: true})
    deactivatedAt : Date

    @Field(() => [SocialLinkModel])
    public socialLinks: SocialLinkModel[]

    @Field(() => Date)
    created_at: Date

    @Field(() => Date)
    updated_at: Date
}