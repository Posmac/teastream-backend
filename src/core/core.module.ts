import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQlConfig } from './config/graphql.config';

@Module({
  imports: [PrismaModule, 
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: getGraphQlConfig,
      imports: [ConfigModule],
      inject: [ConfigService]
    })
  ]
})
export class CoreModule {}
