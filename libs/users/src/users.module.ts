import { Module, Provider } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity, UserProfilesRepo } from './entities/user-profile.entity';
import { DataSource } from 'typeorm';
import { UserEntity, UsersRepo } from './entities/user.entity';

const MODELS = [
  [UsersRepo, UserEntity],
  [UserProfilesRepo, UserProfileEntity],
] as [symbol, typeof UserEntity][];

@Module({
  imports: [TypeOrmModule.forFeature(MODELS.map(([,entity]) => entity))],
  controllers: [UsersController],
  providers: MODELS.map(([repo, entity]) => ({
    provide: repo,
    inject: [DataSource],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
  } as Provider)).concat([
    UsersService,
  ]),
  exports: [UsersService],
})
export class UsersModule {}
