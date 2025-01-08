import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'


export class EditUserDto {
    @ApiProperty({
        example: 'John',
        type: 'string',
        format: 'string',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        type: 'string',
        format: 'string',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        example: '104, Shree flats , Aatman society',
        type: 'string',
        format: 'string',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        example: '9685967485',
        type: 'string',
        format: 'string',
        required: true,
    })
    @IsString()
    @Length(10)
    @IsNotEmpty()
    contact_no: string;

    @ApiProperty({
        example: '2000-02-01',
        type: 'string',
        format: 'string',
        required: false,
    })
    @IsString()
    @IsOptional()
    dob: string;
}