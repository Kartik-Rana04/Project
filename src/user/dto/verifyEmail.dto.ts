import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'demo@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
    email: string;
}
