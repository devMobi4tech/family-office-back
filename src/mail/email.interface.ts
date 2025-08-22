export interface IEmailService {
  sendUserRecoverPasswordToken(
    fullName: string,
    email: string,
    token: string,
  ): Promise<void>;
}
