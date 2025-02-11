import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {

    }

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
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
                display_name: username
            }
        })

        return true;
    }
}
