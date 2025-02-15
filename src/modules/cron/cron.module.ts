import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import {ScheduleModule} from "@nestjs/schedule"
import { TelegramService } from '../libs/telegram/telegram.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, TelegramService],
})
export class CronModule {}
