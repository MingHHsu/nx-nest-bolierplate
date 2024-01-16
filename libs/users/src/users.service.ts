import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UsersRepo,
  UserEntity,
  UserProfilesRepo,
  UserProfileEntity,
} from './entities';
import { PageInfo } from '@utils';
import { FindAllUsersDto } from './dto/find-all-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  getUser(user?: UserEntity | null) {
    return user ? Object.assign(user.profile, {
      email: user.email,
      emailVerified: user.emailVerified,
    }) : null;
  }

  async findAll(options: FindAllUsersDto): Promise<[UserEntity[], PageInfo]> {
    const qb = this.usersRepo.createQueryBuilder('users')
      .leftJoinAndSelect('users.profile', 'profile');

    qb.take(options.limit);
    qb.skip(options.offset);

    const [users, totalCount] = await qb.getManyAndCount();

    return [
      users,
      {
        offset: options.offset,
        limit: options.limit,
        totalCount,
      },
    ];
  }

  async findById(id: string) {
    return await this.usersRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
  }

  async findByEmail(email: string) {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
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

      return Object.assign(user, { profile }) as UserEntity;
    });
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto) {
    return await this.userProfilesRepo.save(
      this.userProfilesRepo.create(
        Object.assign(user, updateUserDto)
      )
    );
  }

  async delete(user: UserEntity) {
    return await this.usersRepo.softDelete(user.id);
  }

  async checkPassword(userPassword: UserEntity['password'], inputPassword: string) {
    return await argon2.verify(userPassword, inputPassword, { type: argon2.argon2id });
  }

  async changePassword(user: UserEntity, password: UserEntity['password']) {
    return await this.usersRepo.save(
      this.usersRepo.create({
        ...user,
        password: await argon2.hash(password, { type: argon2.argon2id }),
      })
    );
  }
}
