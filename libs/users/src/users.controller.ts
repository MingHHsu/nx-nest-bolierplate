import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { DuplicatedResourceException } from '@utils';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const existedUser = await this.usersService.findByEmail(createUserDto.email);

    if (existedUser) {
      throw new DuplicatedResourceException({
        message: 'Email already registered',
        resourceName: 'User',
        references: { email: createUserDto.email },
      });
    }
  
    return await this.usersService.create(createUserDto);
  }
}
