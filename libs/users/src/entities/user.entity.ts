import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const UsersRepo = Symbol('UsersRepo');

@Entity({ name: 'users', synchronize: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'test@google.com',
  })
  @Column({
    type: 'varchar',
    unique: true,
    comment: '信箱',
  })
  email!: string;

  @Column({
    name: 'email_verified',
    type: 'bool',
    default: false,
    comment: '信箱驗證',
  })
  emailVerified!: boolean;

  @ApiProperty({
    example: 'password',
  })
  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', comment: '建立時間' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', comment: '更新時間' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', comment: '刪除時間' })
  deletedAt!: Date;
}
