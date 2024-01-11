import { UnauthorizedException } from "@nestjs/common";

export class NoTokenProvidedException extends UnauthorizedException {
  constructor() {
    super({ message: 'No token provided' });
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super({ message: 'Token expired' });
  }
}

export class WrongPasswordException extends UnauthorizedException {
  constructor() {
    super({ message: 'Wrong password' });
  }
}