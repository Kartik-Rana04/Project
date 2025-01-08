import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";



export class LoginDto {
    @ApiProperty({
        example: 'admin@gmail.com',
        type: 'string',
        format: 'string',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Admin@123',
        type: 'string',
        format: 'string',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}