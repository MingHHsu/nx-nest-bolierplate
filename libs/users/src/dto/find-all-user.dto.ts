import { OffsetBased, QSToArray, QSToEnum } from "@utils";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { GenderEnum } from "../enum";

export class FindAllUsersDto extends OffsetBased {
  @QSToArray({ nullable: true })
  userIds?: string[] | null;

  @ApiPropertyOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional()
  @IsString()
  email?: string | null;

  @QSToEnum(GenderEnum, { nullable: true })
  gender?: GenderEnum | null;

  @QSToEnum(GenderEnum, { nullable: true, isArray: true })
  genders?: GenderEnum[] | null;
}