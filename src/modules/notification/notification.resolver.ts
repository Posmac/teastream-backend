import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decoratos';
import { User } from 'prisma/generated';
import { NotificationModel } from './models/notificaiton.model';
import { ChangeNotificationsSettingsResponse } from './models/notification-settings.model';
import { ChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorization()
	@Query(() => Number, { name: 'findNotificationsUnreadCount' })
	public async findUnreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user)
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
	public async findByUser(@Authorized() user: User) {
		return this.notificationService.findByUser(user)
	}

	@Authorization()
	@Mutation(() => ChangeNotificationsSettingsResponse, { name: 'changeNotificationsSettings' })
	public async changeSettings(@Authorized() user: User, @Args('data') input: ChangeNotificationsSettingsInput) {
		return this.notificationService.changeSettings(user, input)
	}
}
