/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@libs/users';
import { AuthService } from './auth.service';
import { Auth, JWTPayload } from './decorators';
import { ResourceNotFoundException, WrongPasswordException } from '@utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new ResourceNotFoundException({
        resourceName: 'User',
        references: { email: loginDto.email },
      });
    }

    const isValid = await this.usersService.checkPassword(user.password, loginDto.password);

    if (!isValid) throw new WrongPasswordException();

    return await this.authService.generateJWT(user);    
  }

  @Auth()
  @Get('/me')
  async me(@JWTPayload('userId') userId: string) {
    return await this.usersService.findById(userId);
  }

}
