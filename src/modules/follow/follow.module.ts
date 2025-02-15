import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Module({
  providers: [FollowResolver, FollowService, NotificationService, TelegramService],
})
export class FollowModule {}
