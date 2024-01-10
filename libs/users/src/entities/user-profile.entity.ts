import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { GenderEnum } from "../enum/gender.enum";
import { IsEnum, IsString } from "class-validator";
import { UserEntity } from "./user.entity";

export const UserProfilesRepo = Symbol('UserProfilesRepo');

@Entity({ name: 'user_profiles', synchronize: true })
export class UserProfileEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user!: UserEntity;

  @ApiProperty({ example: 'Ming' })
  @Column()
  @IsString()
  name!: string;

  @ApiProperty({ example: '0987654321' })
  @Column({ nullable: true })
  @IsString()
  phone!: string | null;

  @ApiProperty({
    type: String,
    enum: GenderEnum,
    example: GenderEnum.OTHER,
  })
  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.OTHER,
    comment: '性別',
  })
  @IsEnum(GenderEnum)
  gender!: GenderEnum | null;
}
