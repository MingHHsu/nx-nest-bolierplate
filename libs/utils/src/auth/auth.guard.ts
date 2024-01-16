import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { NoTokenProvidedException } from "../exceptions";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest<Request>();

    const token = new Headers(request.headers)?.get('authorization')?.replace(/^Bearer\s/, '');

    if (!token) throw new NoTokenProvidedException();

    return true;
  }
}