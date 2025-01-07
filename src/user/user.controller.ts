import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ModuleName } from 'src/libs/utils/enum';
import { AddUserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';


@Controller('user')
export class UserController {
    constructor(private readonly userServices : UserService){}
    @Get('')
    @ApiTags(ModuleName.USER)
    @HttpCode(HttpStatus.OK)
    getUsers(){
         return this.userServices.getUsers();
    }

    @ApiTags(ModuleName.USER)
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted:true}))
    @Post('addUser')
    registerUser(@Body() dto:AddUserDto){
        return this.userServices.registerUser(dto)     
    }

    @ApiTags(ModuleName.USER)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
      return this.userServices.login(loginDto);
    }


}
