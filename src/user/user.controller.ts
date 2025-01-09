import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ModuleName } from 'src/libs/utils/enum';
import { AddUserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpAndUpdatePasswordDto } from './dto/VerifyOtpAndUpdatePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { EditUserDto } from './dto/editUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userServices: UserService) { }

  @ApiTags(ModuleName.USER)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('addUser')
  registerUser(@Body() dto: AddUserDto) {
    return this.userServices.registerUser(dto)
  }

  @ApiTags(ModuleName.USER)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.userServices.login(loginDto);
  }

  @ApiTags(ModuleName.USER)
  @Post('verifyEmail')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userServices.verifyEmail(dto);
  }

  @ApiTags(ModuleName.USER)
  @Post('verifyOtpAndUpdatePassword')
  verifyOtpAndUpdatePassword(@Body() dto: VerifyOtpAndUpdatePasswordDto) {
    return this.userServices.verifyOtpAndUpdatePassword(dto);
  }

  @ApiTags(ModuleName.USER)
  @Get('userProfile/:userId')
  @ApiParam({ example: 1, name: 'userId', required: true })
  viewProfile(@Param('userId') userId: number) {
    return this.userServices.viewProfile(userId)
  }

  @ApiTags(ModuleName.USER)
  @Put('updateProfile/:userId')
  @ApiParam({ example: 1, name: "userId", required: true })
  updateProfile(@Param('userId') userId: number,
    @Body() dto: EditUserDto
  ) {
    return this.userServices.updateProfile(userId, dto)
  }

  @Put('changePassword/:userId')
  changePassword(@Param('userId') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    console.log('controller userId', userId)
    return this.userServices.changePassword(userId, dto);
  }

}
