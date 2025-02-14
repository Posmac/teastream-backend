import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LivekitService } from '../libs/livekit/livekit.service';

@Injectable()
export class WebhookService {

    public constructor(private readonly prismaService: PrismaService, private readonly liveKitService: LivekitService) {

    }

    public async receiveWebhookLiveKit(body: string, authorization : string) {
        const event = await this.liveKitService.whreceiver.receive(body, authorization, true)

        if(event.event === "ingress_started") {

            console.log("Stream started!")

            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo.ingressId
                },
                data: {
                    isLive: true
                }
            })
        }

        if(event.event === "ingress_ended") {

            console.log("Stream ended!")

            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo.ingressId
                },
                data: {
                    isLive: false
                }
            })
        }


    }
}
