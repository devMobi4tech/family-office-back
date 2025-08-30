import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { TypeORMModule } from './config/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './mail/email.module';
import { InvestorProfileModule } from './investor-profile/investor-profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    UserModule,
    AuthModule,
    AddressModule,
    EmailModule,
    InvestorProfileModule,
  ],
})
export class AppModule {}
