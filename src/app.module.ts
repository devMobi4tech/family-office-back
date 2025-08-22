import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { TypeORMModule } from './config/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './mail/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeORMModule,
    UserModule,
    AuthModule,
    AddressModule,
    EmailModule,
  ],
})
export class AppModule {}
