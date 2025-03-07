import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { RedisService } from 'src/core/redis/redis.service';
import { destroySession, saveSession } from 'src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';
import {TOTP} from "otpauth"

@Injectable()
export class SessionService {
    public constructor(private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService, 
        private readonly verificationService: VerificationService
    ) {

    }

    public async findByUser(req: Request) {
        const userId = req.session.userId

        if(!userId) {
            throw new NotFoundException("User is unathorized")
        }

        const keys = await this.redisService.keys('*')

        const userSessions = []

        for(const key of keys) {
            const sessionData = await this.redisService.get(key)

            if(sessionData) {
                const session = JSON.parse(sessionData)

                if(session.userId === userId) 
                {
                    userSessions.push({
                        id: key.split(':')[1],
                        ...session
                    })
                }
            }
        }

        userSessions.sort((lha, rha) => rha.created_at - lha.created_at)
        userSessions.filter(session => session.id !== req.sessionID)
        console.log(userSessions)

        return userSessions
    }

    public async findCurrent(req: Request) {
		const sessionId = req.session.id

		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		const session = JSON.parse(sessionData)

		return {
			...session,
			id: sessionId
		}
	}

    public async login(req: Request, input: LoginInput, userAgent: string) {
        
        const {login, password, pin} = input;

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {username: {equals: login}},
                    {email: {equals: login}},
                ]
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Wrong password")
        }

        if(!user.isEmailVerified) {
            throw new BadRequestException("Acoount is not verified. Check your email")
        }

        if(user.isTotpEnabled) {
            if(!pin) {
                return {
                    message: "Необходим код для завершения авторизации"
                }
            }

            const totp = new TOTP({
                issuer: 'TeaStream',
                label: `${user.email}`,
                algorithm: 'SHA1',
                digits: 6,
                secret: user.totpSecret
            })

            const delta = totp.validate({token: pin})

            if(delta === null) {
                throw new BadRequestException("Pin is incorrect")
            }
        }

        const metaData = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metaData)
    }

    public async logout(req: Request) {
        return destroySession(req, this.configService)
    }

    public async clearSession(req: Request) {
		req.res.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME')
		)

		return true
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('Текущую сессию удалить нельзя')
		}
 
		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)

		return true
	}

    public async removeAll(req: Request) {
        if (!req.session.id) {
            throw new ConflictException('Сессия не существует');
        }
    
        const sessionPrefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    
        const keys = await this.redisService.keys(`${sessionPrefix}*`);

        for (const key of keys) {
            await this.redisService.del(key);
        }
    
        return true;
    }
}
