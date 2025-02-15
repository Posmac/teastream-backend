import { Module, RequestMethod } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MiddlewareConfiguration, MiddlewareConsumer } from '@nestjs/common/interfaces';
import { RawBodyMiddleware } from 'src/shared/middlewares/raw-body.middleware';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService, TelegramService],
})
export class WebhookModule {

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes({
        path: "webhook/livekit",
        method: RequestMethod.POST
    })
  }
}
