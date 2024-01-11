import { UserEntity } from '@libs/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { JWTPayload } from './pipes/parse-jwt-payload.pipe';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
  ) {}

  createJwtPayload(user: UserEntity): JWTPayload {
    return {
      userId: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async generateJWT(user: UserEntity) {
    const jwtPayload = this.createJwtPayload(user);

    const accessToken: string = sign(
      jwtPayload,
      this.config.get('AUTH_JWT_ACCESS_SECRET')!,
      {
        expiresIn: this.config.get('AUTH_JWT_ACCESS_EXPIRES_IN'),
      },
    );

    const refreshToken: string = sign(
      jwtPayload,
      this.config.get('AUTH_JWT_REFRESH_SECRET')!,
      {
        expiresIn: this.config.get('AUTH_JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async verifyJWTToken(token: string): Promise<ReturnType<typeof this.createJwtPayload>> {
    return await verify(
      token,
      this.config.get('AUTH_JWT_ACCESS_SECRET')!
    ) as ReturnType<typeof this.createJwtPayload> || undefined;
  }
}
