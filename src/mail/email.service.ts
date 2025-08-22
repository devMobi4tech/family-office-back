import { Injectable } from '@nestjs/common';
import { IEmailService } from './email.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { dirname, join } from 'path';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private mailerService: MailerService) {}
  async sendUserRecoverPasswordToken(
    fullName: string,
    email: string,
    token: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha',
      template: './reset-password',
      context: { name: fullName, token },
    });
  }
}
