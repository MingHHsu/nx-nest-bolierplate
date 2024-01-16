import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth, DuplicatedResourceException, ResourceNotFoundException, wrapResponse } from '@utils';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('/')
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    const [users, pageInfo] = await this.usersService.findAll(findAllUsersDto);

    return wrapResponse(users.map(this.usersService.getUser), pageInfo);
  }

  @Auth()
  @Get('/:id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    return wrapResponse(this.usersService.getUser(user));
  }

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

    return wrapResponse(await this.usersService.create(createUserDto));
  }

  @Auth()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new ResourceNotFoundException({
        resourceName: 'User',
        references: { id },
        message: 'User not found',
      });
    }

    return wrapResponse(await this.usersService.update(user, updateUserDto));
  }

  @Auth()
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new ResourceNotFoundException({
        resourceName: 'User',
        references: { id },
        message: 'User not found',
      });
    }

    await this.usersService.delete(user);

    return wrapResponse('success');
  }
}
