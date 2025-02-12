import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { TokenType } from 'prisma/generated';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
    
    public constructor(private readonly prismaService: PrismaService, private readonly mailSerivce: MailService) {

    }

    public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
        const {email} = input
        
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            throw new NotAcceptableException("User not found")
        }

        const passwordResetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET)
        const metadata = getSessionMetadata(req, userAgent)
        await this.mailSerivce.sendPasswordResetToken(user.email, passwordResetToken.token, metadata)

        return true
    }

    public async newPassword(input: NewPasswordInput) {
        const {password, token} = input
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })

        if(!existingToken) {
            throw new NotFoundException("Token not found")
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if(hasExpired) {
            throw new BadRequestException("Token expired")
        }

        await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                password: await hash(input.password)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }

}
