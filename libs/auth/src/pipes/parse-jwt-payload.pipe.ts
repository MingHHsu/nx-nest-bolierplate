
import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from '../auth.service';

export type JWTPayload = {
  userId: string;
  email: string;
  emailVerified: boolean;
};

export type JWTPayloadKeys = keyof JWTPayload;

@Injectable()
export class ParseJWTPayloadPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  async transform({ token, key }: { token: string; key: JWTPayloadKeys; }) {
    const jwtPayload = await this.authService.verifyJWTToken(token);
    return jwtPayload?.[key] ?? null;
  }
}

