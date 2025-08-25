import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { ResetToken } from 'src/auth/entities/reset_token.entity';
import { User } from 'src/user/entities/user.entity';

const ConnectionsTypes = {
  mysql: 'mysql',
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'default',
      useFactory: (config: ConfigService) => {
        return {
          type: ConnectionsTypes[
            config.get<string>('DATABASE_TYPE') ?? 'mysql'
          ],
          host: config.get<string>('DATABASE_HOST'),
          port: parseInt(config.get<string>('DATABASE_PORT') ?? '3308'),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          entities: [User, Address, ResetToken],
          synchronize: config.get<boolean>('DATABASE_SYNCHRONIZE'),
          timezone: 'z',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class TypeORMModule {}
