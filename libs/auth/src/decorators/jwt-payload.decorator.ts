import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayloadKeys, ParseJWTPayloadPipe } from '../pipes/parse-jwt-payload.pipe';

export function JWTPayload(key: JWTPayloadKeys) {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const token = new Headers(request.headers)?.get('Authorization')?.replace(/^Bearer\s/, '');
    return { token, key };
  })(ParseJWTPayloadPipe);
};
