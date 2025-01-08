import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddUserDto } from './dto/user.dto';
import { UserData } from 'src/libs/utils/interface';
import { AuthUser } from 'src/model/authUser.model';
import { DbService } from 'src/libs/services/db.service';
import { HandleResponse } from 'src/libs/helper/exception-filter/helperResponse';
import { ResponseData } from 'src/libs/utils/enum';
import { Messages } from 'src/libs/utils/message';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpAndUpdatePasswordDto } from './dto/VerifyOtpAndUpdatePassword.dto';
import { Otp } from 'src/model/otp.model';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { emailSend } from 'src/libs/helper/mail';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Otp) private otpModel: typeof Otp,
    @InjectModel(AuthUser)
    private userModel: typeof AuthUser,
    private dbService: DbService,
    private jwt: JwtService
  ) { }

  async registerUser(
    dto: AddUserDto
  ) {
    const {
      firstName,
      lastName,
      address,
      contact_no,
      email,
      dob,
      password
    } = dto

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: UserData = {
      firstName,
      lastName, address,
      contact_no,
      email,
      dob,
      password: hashedPassword
    }

    const emailFormat = await AuthUser.findOne({
      where: { email: email },
    });

    if(emailFormat){
      Logger.error(Messages.ALREADY_REGISTERED);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `User ${ Messages.ALREADY_REGISTERED} Try with different email!`
        );
    }

    const addUser: UserData = await this.dbService.create(
      this.userModel,
      user
    )

    Logger.log(`User details ${Messages.REGISTERED_SUCCESS}`)
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      addUser,
      `user added ${Messages.REGISTERED_SUCCESS}`
    )
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const findUser: AuthUser = await this.dbService.findOne(
      this.userModel,
      { email },
      undefined,
      { message: Messages.USER_NOT_FOUND },
    );

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      findUser.password,
    );

    if (!isPasswordValid) {
      Logger.error(`Credentials ${Messages.DOES_NOT_MATCH}`);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `Credentials ${Messages.DOES_NOT_MATCH}`,
      );
    } else {
      Logger.log(Messages.LOGIN_SUCCESS);
      const tokenPayload = {
        id: findUser.id,
        email: findUser.email
      }

      const token: string = this.jwt.sign(tokenPayload)
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        Messages.LOGIN_SUCCESS,
        { token }
      );
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { email } = dto;
    const userEmail = await this.dbService.findOne(
      this.userModel,
      { email },
      undefined,
      { message: Messages.NOT_FOUND },
      undefined,
      undefined,
      true,
    );

    if (userEmail) {
      const currentTime = moment();
      const expireDate = moment(currentTime).add(6, 'minutes');
      const generateOtp = Math.floor(1000 + Math.random() * 9000);
      const fullName = userEmail.firstName + userEmail.lastName;
      const otpData = {
        otp: generateOtp,
        expiration_time: expireDate,
        email,
        fullName,
      };

      emailSend(otpData);
      const createOtp = await this.dbService.create(this.otpModel, otpData);

      if (createOtp) {
        Logger.log(`${Messages.EMAIL_VERIFY} successfully.`);
        return HandleResponse(
          HttpStatus.OK,
          ResponseData.SUCCESS,
          Messages.EMAIL_SENT,
          { otp: otpData.otp },
          undefined,
        );
      }
    }
  }

  async verifyOtpAndUpdatePassword(dto: VerifyOtpAndUpdatePasswordDto) {
    const { otp, email, password } = dto;
    const findOtp = await this.dbService.findOne(
      this.otpModel,
      { otp, email },
      undefined,
      { message: Messages.OTP_NOT_MATCHED },
      undefined,
      undefined,
      false,
    );

    if (findOtp) {
      const currentTime = moment().format('x');
      const otpValidTime = moment(findOtp.expiration_time).format('x');
      if (otpValidTime > currentTime) {
        await this.dbService.destroy(this.otpModel, { email });

        const findPassword = await this.dbService.findOne(
          this.userModel,
          { email },
          undefined,
          { message: Messages.EMAIL_INCORRECT },
          undefined,
          undefined,
          true,
        );

        if (findPassword) {
          const saltRounds: number = 10;
          const encryptedPassword = await bcrypt.hash(password, saltRounds);
          const [updatePassword] = await this.dbService.update(
            this.userModel,
            { password: encryptedPassword },
            { email },
            undefined,
            { message: Messages.NOT_FOUND },
          );
          if (updatePassword === 1) {
            Logger.log(`Your password ${Messages.UPDATE_SUCCESS}`);
            return HandleResponse(
              HttpStatus.OK,
              ResponseData.SUCCESS,
              `Your password ${Messages.UPDATE_SUCCESS}`,
            );
          }
        }
      } else {
        Logger.log(Messages.OTP_EXPIRED);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          Messages.OTP_EXPIRED,
        );
      }
    }
  }
}
