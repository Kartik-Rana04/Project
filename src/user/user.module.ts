import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthUser } from 'src/model/authUser.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbService } from 'src/libs/services/db.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {config} from 'dotenv'
import { Otp } from 'src/model/otp.model';
import { EmailFormat } from 'src/model/emailFormat.model';
config()

@Module({
  imports : [SequelizeModule.forFeature([
    AuthUser,
    Otp,
    EmailFormat
  ]),
  ConfigModule.forRoot({ isGlobal : true}),
  JwtModule.register({
    secret : `${process.env.JWTSecretKey}` || `secretKey`,
    signOptions : { expiresIn : `12h`}
  })
],
  controllers: [UserController],
  providers: [UserService,DbService]
})
export class UserModule {}
