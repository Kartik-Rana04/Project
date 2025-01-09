import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty,IsEmail,IsNumber, IsString } from "class-validator";

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
      example: 'Kartik@123',
      type: 'string',
      format: 'string',
      required: false,
    })
    @IsString()
    @IsNotEmpty()
      password: string;
  
    @ApiProperty({
      example: 'Kartik@123',
      type: 'string',
      format: 'string',
      required: false,
    })
    @IsString()
    @IsNotEmpty()
      confirmPassword: string;
  }
  