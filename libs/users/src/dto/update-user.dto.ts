import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { UserEntity, UserProfileEntity } from "../entities";

export class UpdateUserDto extends PartialType(
  IntersectionType(
    PickType(UserProfileEntity, ['name', 'phone', 'gender']),
  )
) {}

export class UpdateUserResponseDto extends IntersectionType(
  UserProfileEntity,
  PickType(UserEntity, ['email']),
) {}
