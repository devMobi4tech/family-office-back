export class TokenResponseDto {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class ForgotPasswordResponseDto {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
