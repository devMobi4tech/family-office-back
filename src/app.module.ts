import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { Address } from './address/entities/address.entity';
import { ResetToken } from './auth/entities/reset_token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Address, ResetToken],
      timezone: 'Z',
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
    UserModule,
    AuthModule,
    AddressModule,
  ],
})
export class AppModule {}
