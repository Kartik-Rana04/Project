import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty,IsEmail,IsNumber, IsString, Matches } from "class-validator";
import { Match } from "src/libs/dto/match.decorator";

export class VerifyOtpAndUpdatePasswordDto {
    @ApiProperty({
      example: 'demo@gmail.com',
      type: 'string',
      format: 'string',
      required: true,
    })
    @IsEmail()
    @IsNotEmpty()
      email: string;
  
    @ApiProperty({
      example: 1234,
      type: 'number',
      format: 'number',
      required: true,
    })
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
      otp: number;
  
    @ApiProperty({
      example: 'Shruti@123',
      type: 'string',
      format: 'string',
      required: false,
    })
    @IsString()
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#,-./:;<?\]^_`'])[A-Za-z\d@$!%*#+,-./:;<=^_`']{8,}$/,
      {
        message: 'Your password is too weak',
      },
    )
    @IsNotEmpty()
      password: string;
  
    @ApiProperty({
      example: 'Shruti@123',
      type: 'string',
      format: 'string',
      required: false,
    })
    @IsString()
    @Match('password', { message: 'Your confirm Password is not match.' })
    @IsNotEmpty()
      confirmPassword: string;
  }
  