export class ResponseAuthDto {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
