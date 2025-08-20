import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset_token.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '6h' },
    }),
    TypeOrmModule.forFeature([ResetToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
