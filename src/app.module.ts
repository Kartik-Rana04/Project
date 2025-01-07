import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { AuthUser } from './model/authUser.model';
import { UserModule } from './user/user.module';
config()


console.log('DB Host:', process.env.DB_HOST);
console.log('DB Username:', process.env.DB_USERNAME);
console.log('DB Password:', process.env.DB_PASSWORD);
console.log('DB Name:', process.env.DB_NAME);
console.log('DB Port:', process.env.DB_PORT);

@Module({
  imports: [SequelizeModule.forRoot({
      dialect: 'mysql', // Database type
      host: process.env.DB_HOST, // Database host
      port: +process.env.DB_PORT, // Database port
      username: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      database: process.env.DB_NAME, // Database name
      models: [AuthUser], // Path to models
      autoLoadModels: true, // Automatically load models
      synchronize: true, // Sync models with the database (set to false in production)
  }),
  UserModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

