import { MaxLength } from "class-validator";
import { Sequelize } from "sequelize";
import { AllowNull, Column, Default, Table, Unique, Model } from "sequelize-typescript";

@Table({ tableName: 'auth_user' })
export class AuthUser extends Model<AuthUser> {

  @AllowNull(false)
  @MaxLength(10)
  @Column
  firstName: string

  @AllowNull(false)
  @MaxLength(10)
  @Column
  lastName: string

  @AllowNull(false)
  @MaxLength(20)
  @Column
  address: string

  @AllowNull(false)
  @Unique
  @MaxLength(10)
  @Column
  contact_no: string;

  @AllowNull(false)
  @Unique
  @MaxLength(20)
  @Column
  email: string;

  @AllowNull(true)
  @MaxLength(20)
  @Column
  password: string;

  @AllowNull(true)
  @MaxLength(15)
  @Column
  dob: string;

  @MaxLength(1)
  @Column({ defaultValue: false })
    is_deleted: boolean;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  createdAt: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    ),
  })
  updatedAt: Date;
}