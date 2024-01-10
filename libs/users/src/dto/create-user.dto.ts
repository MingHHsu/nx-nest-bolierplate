import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { UserEntity, UserProfileEntity } from "../entities";

export class CreateUserDto extends IntersectionType(
  PickType(UserEntity, ['email', 'password']),
  PickType(UserProfileEntity, ['name']),
  PartialType(PickType(UserProfileEntity, ['phone', 'gender'])),
) {}

export class CreateUserResponseDto extends IntersectionType(
  UserProfileEntity,
  PickType(UserEntity, ['email']),
) {}
