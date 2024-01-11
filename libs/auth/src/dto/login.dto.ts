import { UserEntity } from "@libs/users";
import { PickType } from "@nestjs/swagger";

export class LoginDto extends PickType(UserEntity, ['email', 'password']) {}