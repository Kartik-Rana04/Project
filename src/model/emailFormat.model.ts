import {
    Column,
    DataType,
    Default,
    Model,
    Sequelize,
    Table,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'email_format' })
  export class EmailFormat extends Model<EmailFormat> {
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
      type: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
      subject: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
      body: string;
  
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
  