import { Field, ID, ObjectType } from "@nestjs/graphql";
import { isNullableType } from "graphql";
import type { User } from "prisma/generated";
import { SocialLinkModel } from "../../profile/models/social-link.model";
import { StreamModel } from "src/modules/stream/models/stream.model";
import { Stream } from "stream";
import { FollowModel } from "src/modules/follow/models/follow.model";
import { NotificationSettingsModel } from "src/modules/notification/models/notification-settings.model";
import { NotificationModel } from "src/modules/notification/models/notificaiton.model";

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

    @Field(() => String, {nullable: true})
    telegramId: string;

    @Field(() => Boolean)
	public isVerified: boolean

	@Field(() => Boolean)
	public isEmailVerified: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean
    
    @Field(()=> String, {nullable: true})
    public totpSecret: string

    @Field(() => Boolean)
    public isDeactivated : boolean

    @Field(() => Date, {nullable: true})
    public deactivatedAt : Date

    @Field(() => [SocialLinkModel])
    public socialLinks: SocialLinkModel[]

    @Field(() => [FollowModel])
    public followers: FollowModel[]

    @Field(() => [FollowModel])
    public followings: FollowModel[]

    @Field(() => [NotificationModel])
    public notifications: NotificationModel[]

    @Field(() => NotificationSettingsModel)
    public notificationSettings: NotificationSettingsModel    

    @Field(() => StreamModel)
    public stream: StreamModel

    @Field(() => Date)
    public created_at: Date

    @Field(() => Date)
    public updated_at: Date
}