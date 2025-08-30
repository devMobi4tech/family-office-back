import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
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
