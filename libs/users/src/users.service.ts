import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import {
  UsersRepo,
  UserEntity,
  UserProfilesRepo,
  UserProfileEntity,
} from './entities';

@Injectable()
export class UsersService {
  constructor (
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(UsersRepo)
    private readonly usersRepo: Repository<UserEntity>,
    @Inject(UserProfilesRepo)
    private readonly userProfilesRepo: Repository<UserProfileEntity>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existedUser = await this.findByEmail(createUserDto.email);

    if (existedUser) {
      throw new BadRequestException('Email already registered');
    }

    return await this.dataSource.transaction(async (entityManager) => {
      const user = await entityManager.getRepository(UserEntity).save(
        this.usersRepo.create({
          email: createUserDto.email,
          emailVerified: false,
          password: await argon2.hash(createUserDto.password, { type: argon2.argon2id }),
        })
      );

      const profile = await entityManager.getRepository(UserProfileEntity).save(
        this.userProfilesRepo.create({
          id: user.id,
          name: createUserDto.name,
          phone: createUserDto.phone,
          gender: createUserDto.gender,
        })
      );

      return Object.assign({}, profile, { email: user.email });
    });
  }

  async validateUser(user: UserEntity, password: string) {
    return await argon2.verify(user.password, password, { type: argon2.argon2id });
  }
}
