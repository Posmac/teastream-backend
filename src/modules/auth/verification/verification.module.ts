import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { MailModule } from 'src/modules/libs/mail/mail.module';

@Module({
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
