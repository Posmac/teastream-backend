import { ChannelService } from './channel.service';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decoratos';
import { User } from 'prisma/generated';
import { UserModel } from '../auth/account/models/user.model';

@Resolver('Channel')
export class ChannelResolver {
  public constructor(private readonly channelService: ChannelService) {}
  
  @Query(() => [UserModel], { name: 'findRecommendedChannels' })
	public async findRecommended() {
		return this.channelService.findRecommended()
	}

	@Query(() => UserModel, { name: 'findChannelByUsername' })
	public async findByUsername(@Args('username') username: string) {
		return this.channelService.findByUsername(username)
	}

	@Query(() => Number, { name: 'findFollowersCountByChannel' })
	public async findFollowersCountByChannel(@Args('channelId') channelId: string) {
		return this.channelService.findFollowersCountByChannel(channelId)
	}

	// @Query(() => [SubscriptionModel], { name: 'findSponsorsByChannel' })
	// public async findSponsorsByChannel(@Args('channelId') channelId: string) {
	// 	return this.channelService.findSponsorsByChannel(channelId)
	// }
}
