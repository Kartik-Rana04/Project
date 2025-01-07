import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthUser } from 'src/model/authUser.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbService } from 'src/libs/services/db.service';

@Module({
  imports : [SequelizeModule.forFeature([AuthUser])],
  controllers: [UserController],
  providers: [UserService,DbService]
})
export class UserModule {}
