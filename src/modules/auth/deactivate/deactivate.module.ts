import { Module } from '@nestjs/common';
import { DeactivateService } from './deactivate.service';
import { DeactivateResolver } from './deactivate.resolver';
import { TelegramService } from 'src/modules/libs/telegram/telegram.service';

@Module({
  providers: [DeactivateResolver, DeactivateService, TelegramService],
})
export class DeactivateModule {}
