import { Global, Module } from '@nestjs/common';
import { MailerOptions, MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from 'src/core/config/mailer.config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: getMailerConfig,
        inject: [ConfigService] 
      }
    )
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
