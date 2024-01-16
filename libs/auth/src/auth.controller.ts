import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@libs/users';
import { AuthService } from './auth.service';
import { JWTPayload } from './decorators';
import { Auth, ResourceNotFoundException, WrongPasswordException, wrapResponse } from '@utils';

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

    return wrapResponse(await this.authService.generateJWT(user));    
  }

  @Auth()
  @Get('/me')
  async me(@JWTPayload('userId') userId: string) {
    const me = await this.usersService.findById(userId);

    return wrapResponse(this.usersService.getUser(me));
  }

  @Auth()
  @Post('/change-password')
  async changePassword(
    @JWTPayload('userId') userId: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new ResourceNotFoundException({
        resourceName: 'User',
        references: { id: userId },
        message: 'User not found',
      });
    }

    const validPassword = await this.usersService.checkPassword(user.password, oldPassword);

    if (!validPassword) throw new WrongPasswordException();

    await this.usersService.changePassword(user, newPassword)
    
    return wrapResponse('success');
  }
}
