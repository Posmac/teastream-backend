import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
    public constructor(private readonly prismaService: PrismaService, private readonly mailService: MailService) {

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
            }
        })

        for(const user of deactivatedAccounts) {
            await this.mailService.sendAccountDeletion(user.email)
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
