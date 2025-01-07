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
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(AuthUser)
    private userModel: typeof AuthUser,
    private dbService : DbService
) { }

    async getUsers() {
       
        return 'hii i am kartik'
    }

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

        const user : UserData = {
            firstName,
            lastName,address,
            contact_no,
            email,
            dob,
            password : hashedPassword
        }

            const addUser : UserData = await this.dbService.create(
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
            return HandleResponse(
              HttpStatus.OK,
              ResponseData.SUCCESS,
              Messages.LOGIN_SUCCESS,
            );
          }
        }
}
