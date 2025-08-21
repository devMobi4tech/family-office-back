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

export class ValidateResetTokenResponseDto {
  isValid: boolean;
  message: string;

  constructor(isValid: boolean, message: string) {
    this.isValid = isValid;
    this.message = message;
  }
}

export class ResetPasswordResponseDto {
  success: boolean;
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
