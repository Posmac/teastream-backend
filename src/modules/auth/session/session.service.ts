import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class SessionService {
    public constructor(private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
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
                
                console.log("Session Metadata:", session.metadata);

                if(session.userId === userId) 
                {
                    userSessions.push({
                        ...session,
                        id: key.split(':')[1]
                    })
                }
            }
        }

        userSessions.sort((lha, rha) => rha.created_at - lha.created_at)

        return userSessions.filter(session => session.id !== req.sessionID)
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
        
        const {login, password} = input;

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

        const metaData = getSessionMetadata(req, userAgent)

        console.log(metaData)

        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id
            req.session.metaData = metaData

            req.session.save(err => {
                if (err) {
                    return reject(new InternalServerErrorException("Cannot save session"))
                }

                resolve(user)
            })
        })
    }

    public async logout(req: Request) {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(new InternalServerErrorException("Cannot save session"))
                }

                req.res.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"))
                resolve(true)
            })
        })
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
}
