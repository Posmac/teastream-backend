import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Stream } from "prisma/generated";
import { UserModel } from "src/modules/auth/account/models/user.model";
import { CategoryModel } from "src/modules/categories/models/category.models";

@ObjectType()
export class StreamModel implements Stream {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String, {nullable: true})
    thumbnailUrl: string;

    @Field(() => String, {nullable: true})
    ingressId: string;

    @Field(() => String, {nullable: true})
    serverUrl: string;

    @Field(() => String, {nullable: true})
    streamKey: string;

    @Field(() => Boolean)
    isLive: boolean;

    @Field(() => Boolean)
    isChatEnabled: boolean;

    @Field(() => Boolean)
    isChatFollowersOnly: boolean;

    @Field(() => Boolean)
    isChatPremiumFollowersOnly: boolean;

    @Field(() => String, {nullable: true})
    userId: string;

    @Field(() => UserModel, {nullable: true})
    user: UserModel;

    @Field(() => String, {nullable: true})
    categoryId: string;

    @Field(() => CategoryModel, {nullable: true})
    category: CategoryModel;

    @Field(() => Date)
    created_at: Date;

    @Field(() => Date)
    updated_at: Date;

}