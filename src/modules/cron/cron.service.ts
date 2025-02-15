import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { Cron } from '@nestjs/schedule';
import { StorageService } from '../storage/storage.service';
import { TelegramService } from '../libs/telegram/telegram.service';

@Injectable()
export class CronService {
    public constructor(private readonly prismaService: PrismaService, private readonly mailService: MailService, private readonly storageService: StorageService,
        private readonly telegramService: TelegramService
    ) {

    }

    @Cron("0 0 * * *")
    //@Cron("*/10 * * * * *")
    public async deleteDeactivatedAccounts() {
        const sevenDaysAgo = new Date()

        sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7)
        //sevenDaysAgo.setSeconds(sevenDaysAgo.getSeconds() - 5)

        const deactivatedAccounts = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true, 
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            },
            include: {
                notificationSettings: true,
                stream: true
            }
        })

        for(const user of deactivatedAccounts) {
            await this.mailService.sendAccountDeletion(user.email)

            if(user.notificationSettings.telegramNotifications && user.telegramId) {
                this.telegramService.sendAccountDeletion(user.telegramId)
            }

            if(user.avatar) {
                this.storageService.remove(user.avatar)
            }

            if(user.stream.thumbnailUrl) {
                this.storageService.remove(user.stream.thumbnailUrl)
            }
        }

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true, 
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }
}
