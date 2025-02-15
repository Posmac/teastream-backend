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
import { LivekitModule } from 'src/modules/libs/livekit/livekit.module';
import { getLiveKitConfig } from './config/livekit.config';
import { IngressModule } from 'src/modules/stream/ingress/ingress.module';
import { WebhookModule } from 'src/modules/webhook/webhook.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { FollowModule } from 'src/modules/follow/follow.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { TelegramModule } from 'src/modules/libs/telegram/telegram.module';
import { StripeModule } from 'src/modules/libs/stripe/stripe.module';
import { getStripeConfig } from './config/stripe.config';
import { PlanModule } from 'src/modules/sponsorship/plan/plan.module';
import { TransactionModule } from 'src/modules/sponsorship/transaction/transaction.module';
import { SubscriptionModule } from 'src/modules/sponsorship/subscription/subscription.module';

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
    LivekitModule.registerAsync({
      useFactory: getLiveKitConfig,
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    StripeModule.registerAsync({
      useFactory: getStripeConfig,
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
    StreamModule,
    IngressModule,
    WebhookModule,
    CategoriesModule, 
    ChatModule,
    FollowModule,
    ChannelModule,
    NotificationModule,
    TelegramModule,
    StripeModule,
    PlanModule,
    TransactionModule,
    SubscriptionModule
  ]
})
export class CoreModule {}
