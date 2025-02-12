import { ConfigService } from "@nestjs/config";
import { isDev } from "src/shared/utils/is-dev.util";
import { join } from "path";
import { MailerOptions } from '@nestjs-modules/mailer';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: false,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD')
			}
		},
		defaults: {
			from: `"TeaStream" ${configService.getOrThrow<string>('MAIL_LOGIN')}`
		}
	}
}