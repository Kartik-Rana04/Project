import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { AuthUser } from './model/authUser.model';
import { UserModule } from './user/user.module';
import { Otp } from './model/otp.model';
config()

@Module({
  imports: [SequelizeModule.forRoot({
      dialect: 'mysql', // Database type
      host: process.env.DB_HOST, // Database host
      port: +process.env.DB_PORT, // Database port
      username: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      database: process.env.DB_NAME, // Database name
      models: [AuthUser,Otp], // Path to models
      autoLoadModels: true, // Automatically load models
      synchronize: true, // Sync models with the database (set to false in production)
  }),
  UserModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

