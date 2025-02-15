import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { TelegramService } from 'src/modules/libs/telegram/telegram.service';

@Module({
  providers: [PasswordRecoveryResolver, PasswordRecoveryService, TelegramService],
})
export class PasswordRecoveryModule {}
