import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQlConfig } from './config/graphql.config';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from 'src/modules/auth/account/account.module';
import { SessionModule } from 'src/modules/auth/session/session.module';
import { VerificationModule } from 'src/modules/auth/verification/verification.module';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { PasswordRecoveryModule } from 'src/modules/auth/password-recovery/password-recovery.module';
import { TotpModule } from 'src/modules/auth/totp/totp.module';
import { DeactivateModule } from 'src/modules/auth/deactivate/deactivate.module';
import { CronModule } from 'src/modules/cron/cron.module';
import { StorageModule } from 'src/modules/storage/storage.module';
import { ProfileModule } from 'src/modules/auth/profile/profile.module';
import { StreamModule } from 'src/modules/stream/stream.module';

@Module({
  imports: [PrismaModule, 
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: getGraphQlConfig,
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    RedisModule,
    AccountModule,
    MailModule,
    StorageModule,
    CronModule,
    SessionModule,
    ProfileModule,
    VerificationModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivateModule,
    StreamModule
  ]
})
export class CoreModule {}
