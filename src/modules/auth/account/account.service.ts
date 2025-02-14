import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2';
import { VerificationService } from '../verification/verification.service';
import { ChangeEmailInput } from './inputs/change-email.input';
import { User } from 'prisma/generated';
import { ChangePasswordInput } from './inputs/change-password.input';

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService, private readonly verificationService: VerificationService) {

    }

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            },
            include: {
                socialLinks: true
            }
        })

        return user
    }

    public async create(input: CreateUserInput) {
        const {username, email, password} = input;

        const isUsernameExists = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (isUsernameExists) {
            throw new ConflictException("This user name is used")
        }

        const isEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (isEmailExists) {
            throw new ConflictException("This email is used")
        }
        
        const user = await this.prismaService.user.create({
            data: {
                username,
                email,
                password: (await hash(password)),
                display_name: username,
                stream: {
                    create: {
                        title: `Стрим ${username}`
                    }
                }
            }
        })

        await this.verificationService.sendVerificationToken(user)

        return true;
    }

    public async changeEmail(user: User, input: ChangeEmailInput) {
        const {email} = input

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                email
            }
        })

        return true
    }

    public async changePassword(user: User, input: ChangePasswordInput) {
        const {oldPassword, newPassword} = input
        
        const isPasswordValid = await verify(user.password, oldPassword)

        if(isPasswordValid === false) {
            throw new UnauthorizedException("Wrong old password!")
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                password: await hash(newPassword)
            }
        })

        return true
    }
}
