import { MaxLength } from "class-validator";
import {  Sequelize } from "sequelize";
import { AllowNull, Column, Default, Model, Table } from "sequelize-typescript";

@Table({ tableName : 'otp'})
export class Otp extends Model<Otp>{
    @AllowNull(true)
    @Column
    @MaxLength(6)
        otp : number

    @AllowNull(false)
    @Column
    @MaxLength(255)
        email : string

    @AllowNull(false)
    @Column
        expiration_time : Date
    
    @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
    @Column({ type : 'TIMESTAMP'})
        createdAt : Date

    
  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    ),
  })
    updatedAt: Date;
}